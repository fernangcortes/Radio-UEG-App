package br.ueg.crialab.radioueg.playback

import android.content.ComponentName
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalInspectionMode
import androidx.core.content.ContextCompat
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.session.MediaController
import androidx.media3.session.SessionToken

class RadioPlayerState(
    val isPlaying: Boolean,
    val isBuffering: Boolean,
    val streamStatus: String,
    val togglePlay: () -> Unit
)

@Composable
fun rememberRadioPlayer(): RadioPlayerState {
    val isPreview = LocalInspectionMode.current
    if (isPreview) {
        return RadioPlayerState(
            isPlaying = false,
            isBuffering = false,
            streamStatus = "Modo de Visualização",
            togglePlay = {}
        )
    }

    val context = LocalContext.current
    var controller by remember { mutableStateOf<MediaController?>(null) }
    var isPlaying by remember { mutableStateOf(false) }
    var isBuffering by remember { mutableStateOf(false) }
    var streamStatus by remember { mutableStateOf("Pronto para tocar • Zeno.fm Ao Vivo") }

    DisposableEffect(context) {
        val sessionToken = SessionToken(
            context,
            ComponentName(context, RadioPlaybackService::class.java)
        )
        val controllerFuture = MediaController.Builder(context, sessionToken).buildAsync()

        val listener = object : Player.Listener {
            override fun onIsPlayingChanged(playing: Boolean) {
                isPlaying = playing
                if (playing) {
                    isBuffering = false
                    streamStatus = "NO AR AO VIVO • Rádio UEG Educativa"
                } else if (!isBuffering) {
                    streamStatus = "Transmissão pausada"
                }
            }

            override fun onPlaybackStateChanged(playbackState: Int) {
                when (playbackState) {
                    Player.STATE_BUFFERING -> {
                        isBuffering = true
                        streamStatus = "Conectando ao stream Zeno.fm..."
                    }
                    Player.STATE_READY -> {
                        isBuffering = false
                        if (isPlaying) {
                            streamStatus = "NO AR AO VIVO • Rádio UEG Educativa"
                        }
                    }
                    Player.STATE_ENDED -> {
                        isBuffering = false
                        isPlaying = false
                        streamStatus = "Transmissão finalizada"
                    }
                    Player.STATE_IDLE -> {
                        isBuffering = false
                    }
                }
            }

            override fun onPlayerError(error: PlaybackException) {
                isBuffering = true
                isPlaying = false
                streamStatus = "Reconectando ao stream Zeno.fm..."
            }
        }

        controllerFuture.addListener(
            {
                try {
                    val mediaController = controllerFuture.get()
                    controller = mediaController
                    mediaController.addListener(listener)

                    // Sincroniza estado caso o serviço já esteja tocando em segundo plano
                    isPlaying = mediaController.isPlaying
                    isBuffering = mediaController.playbackState == Player.STATE_BUFFERING
                    if (isPlaying) {
                        streamStatus = "NO AR AO VIVO • Rádio UEG Educativa"
                    }
                } catch (_: Exception) {
                    streamStatus = "Pronto para tocar • Zeno.fm Ao Vivo"
                }
            },
            ContextCompat.getMainExecutor(context)
        )

        onDispose {
            controller?.removeListener(listener)
            MediaController.releaseFuture(controllerFuture)
        }
    }

    val togglePlay = {
        val ctrl = controller
        if (ctrl != null) {
            if (ctrl.isPlaying || ctrl.playbackState == Player.STATE_BUFFERING) {
                ctrl.stop()
                isPlaying = false
                isBuffering = false
                streamStatus = "Transmissão pausada"
            } else {
                isBuffering = true
                streamStatus = "Conectando ao stream Zeno.fm..."

                val metadata = MediaMetadata.Builder()
                    .setTitle("Rádio UEG Educativa")
                    .setArtist("No Ar Ao Vivo • CriaLab|UEG")
                    .setAlbumTitle("Universidade Estadual de Goiás")
                    .build()

                val mediaItem = MediaItem.Builder()
                    .setUri(RadioPlaybackService.STREAM_URL)
                    .setMediaMetadata(metadata)
                    .build()

                ctrl.setMediaItem(mediaItem)
                ctrl.prepare()
                ctrl.play()
            }
        }
    }

    return remember(isPlaying, isBuffering, streamStatus, controller) {
        RadioPlayerState(
            isPlaying = isPlaying,
            isBuffering = isBuffering,
            streamStatus = streamStatus,
            togglePlay = togglePlay
        )
    }
}
