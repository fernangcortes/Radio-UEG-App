package br.ueg.crialab.radioueg.ui.main

import android.annotation.SuppressLint
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalInspectionMode
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.navigation3.runtime.NavKey
import br.ueg.crialab.radioueg.ui.theme.CriaLabAmber
import br.ueg.crialab.radioueg.ui.theme.CriaLabCoral
import br.ueg.crialab.radioueg.ui.theme.CriaLabMagenta
import br.ueg.crialab.radioueg.ui.theme.CriaLabOlive
import br.ueg.crialab.radioueg.ui.theme.CriaLabTeal
import br.ueg.crialab.radioueg.ui.theme.IvoryBackground
import br.ueg.crialab.radioueg.ui.theme.IvoryElevated
import br.ueg.crialab.radioueg.ui.theme.IvorySurface
import br.ueg.crialab.radioueg.ui.theme.RadioUEGEducativaTheme
import br.ueg.crialab.radioueg.ui.theme.TextMuted
import br.ueg.crialab.radioueg.ui.theme.TextPrimary

private const val ZENO_STREAM_URL = "https://stream.zeno.fm/zs5dawmagc3vv"

// 19 barras verticais exatas da logo da Rádio UEG Educativa
private val LOGO_WAVE_HEIGHTS = listOf(
    0.24f, 0.46f, 0.98f, 0.36f, 0.68f, 0.26f, 0.46f, 0.30f, 0.42f, 0.60f,
    0.42f, 0.34f, 0.86f, 0.46f, 0.28f, 0.42f, 0.54f, 0.34f, 0.24f
)

private val CRIALAB_PALETTE = listOf(
    CriaLabMagenta,
    CriaLabCoral,
    CriaLabAmber,
    CriaLabOlive,
    CriaLabTeal
)

data class DesignPreset(
    val id: String,
    val name: String,
    val bg: Color,
    val surface: Color,
    val elevated: Color,
    val text: Color,
    val muted: Color,
    val accent: Color,
    val secondary: Color
)

private val DESIGN_PRESETS = listOf(
    DesignPreset(
        id = "marfim-crialab",
        name = "Branco Marfim (Padrão)",
        bg = IvoryBackground,
        surface = IvorySurface,
        elevated = IvoryElevated,
        text = TextPrimary,
        muted = TextMuted,
        accent = CriaLabTeal,
        secondary = CriaLabCoral
    ),
    DesignPreset(
        id = "areia-cerrado",
        name = "Areia do Cerrado",
        bg = Color(0xFFF5EFE6),
        surface = Color(0xFFFFFDF9),
        elevated = Color(0xFFEBE3D5),
        text = Color(0xFF1C1917),
        muted = Color(0xFF57534E),
        accent = CriaLabCoral,
        secondary = CriaLabTeal
    ),
    DesignPreset(
        id = "papel-editorial",
        name = "Papel Jornal",
        bg = Color(0xFFFDFBF7),
        surface = Color(0xFFFFFFFF),
        elevated = Color(0xFFF4F1EA),
        text = Color(0xFF0F172A),
        muted = Color(0xFF475569),
        accent = CriaLabMagenta,
        secondary = CriaLabAmber
    ),
    DesignPreset(
        id = "estudio-noturno",
        name = "Estúdio Noturno",
        bg = Color(0xFF12151B),
        surface = Color(0xFF1B1F27),
        elevated = Color(0xFF242933),
        text = Color(0xFFF8FAFC),
        muted = Color(0xFF94A3B8),
        accent = CriaLabTeal,
        secondary = CriaLabAmber
    )
)

data class RadioProgramItem(
    val time: String,
    val title: String,
    val host: String,
    val category: String,
    val badgeColor: Color
)

private val SCHEDULE_ITEMS = listOf(
    RadioProgramItem("00:00 - 06:00", "Madrugada Viva", "Curadoria Rádio UEG", "Musical", CriaLabTeal),
    RadioProgramItem("06:00 - 08:00", "Vida que Pulsa", "Equipe Rádio UEG", "Manhã UEG", CriaLabAmber),
    RadioProgramItem("08:00 - 09:00", "Interprogramas & Drops", "Rádio UEG + Rádio Câmara", "Informativo", CriaLabCoral),
    RadioProgramItem("12:00 - 13:00", "Sintonia", "Thaís Oliveira & Equipe", "Revista do Meio-Dia", CriaLabCoral),
    RadioProgramItem("13:00 - 14:00", "Conversa com o Reitor", "Reitoria UEG (Segundas)", "Institucional", CriaLabTeal),
    RadioProgramItem("14:00 - 15:00", "Parcerias em Rede (UNESP / UFOP)", "Rede Universitária", "Documentário", CriaLabOlive),
    RadioProgramItem("18:00 - 19:00", "Sunset — Música para o Pôr do Sol", "Curadoria Musical", "Fim de Tarde", CriaLabMagenta),
    RadioProgramItem("20:00 - 21:00", "Rock Gyn / Ondas Negras / Fabular", "Faixa Especial Noturna", "Cultura & Arte", CriaLabCoral)
)

@Composable
fun MainScreen(
    onItemClick: (NavKey) -> Unit,
    modifier: Modifier = Modifier
) {
    MainScreenContent(modifier = modifier)
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun MainScreenContent(
    modifier: Modifier = Modifier,
    initialTab: Int = 0,
    initialShowDesignStudio: Boolean = false
) {
    var selectedPresetIndex by remember { mutableIntStateOf(0) }
    var multiColorWaves by remember { mutableStateOf(true) }
    var selectedTab by remember { mutableIntStateOf(initialTab) }
    var showDesignStudio by remember { mutableStateOf(initialShowDesignStudio) }
    var useWebAppView by remember { mutableStateOf(false) }

    var isPlaying by remember { mutableStateOf(false) }
    var isBuffering by remember { mutableStateOf(false) }
    var streamStatus by remember { mutableStateOf("Pronto para tocar • Zeno.fm Ao Vivo") }

    val isPreview = LocalInspectionMode.current
    val mediaPlayer = remember(isPreview) { if (isPreview) null else MediaPlayer() }

    DisposableEffect(mediaPlayer) {
        onDispose {
            try {
                if (mediaPlayer?.isPlaying == true) {
                    mediaPlayer.stop()
                }
                mediaPlayer?.release()
            } catch (_: Exception) {
            }
        }
    }

    fun toggleLiveStream() {
        val player = mediaPlayer ?: return
        if (isPlaying || isBuffering) {
            try {
                player.reset()
            } catch (_: Exception) {
            }
            isPlaying = false
            isBuffering = false
            streamStatus = "Transmissão pausada"
        } else {
            isBuffering = true
            streamStatus = "Conectando ao stream Zeno.fm..."
            try {
                player.reset()
                player.setAudioAttributes(
                    AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .build()
                )
                player.setDataSource(ZENO_STREAM_URL)
                player.setOnPreparedListener { mp ->
                    mp.start()
                    isBuffering = false
                    isPlaying = true
                    streamStatus = "NO AR AO VIVO • Rádio UEG Educativa"
                }
                player.setOnErrorListener { _, _, _ ->
                    isBuffering = false
                    isPlaying = false
                    streamStatus = "Reconectando ao stream Zeno.fm..."
                    true
                }
                player.prepareAsync()
            } catch (e: Exception) {
                isBuffering = false
                isPlaying = false
                streamStatus = "Erro ao iniciar stream: ${e.localizedMessage ?: "verifique rede"}"
            }
        }
    }

    val theme = DESIGN_PRESETS[selectedPresetIndex]

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = theme.bg,
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(theme.surface)
            ) {
                // Faixa Superior Oficial CriaLab 5 Cores
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(5.dp)
                ) {
                    CRIALAB_PALETTE.forEach { color ->
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxHeight()
                                .background(color)
                        )
                    }
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    // Logo Rádio UEG Educativa com as 19 ondas
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        RadioWaveLogoCompose(
                            accentColor = theme.accent,
                            multiColor = multiColorWaves,
                            isAnimating = isPlaying
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Row(verticalAlignment = Alignment.Bottom) {
                                Text(
                                    text = "RÁDIO ",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Normal,
                                    color = theme.text
                                )
                                Text(
                                    text = "UEG",
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.Black,
                                    color = theme.text
                                )
                            }
                            Text(
                                text = "EDUCATIVA • CRIALAB",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.5.sp,
                                color = theme.accent
                            )
                        }
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (showDesignStudio) theme.accent else theme.elevated,
                            modifier = Modifier.clickable { showDesignStudio = !showDesignStudio }
                        ) {
                            Text(
                                text = "Design",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (showDesignStudio) Color.White else theme.text,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (useWebAppView) CriaLabCoral else theme.elevated,
                            modifier = Modifier.clickable { useWebAppView = !useWebAppView }
                        ) {
                            Text(
                                text = if (useWebAppView) "App Nativo" else "Web App",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (useWebAppView) Color.White else theme.text,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                    }
                }
                HorizontalDivider(color = theme.text.copy(alpha = 0.08f))
            }
        },
        bottomBar = {
            Surface(
                color = theme.surface,
                shadowElevation = 8.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    val tabs = listOf("Ao Vivo", "Grade 24h", "Notícias", "Hub & Equipe")
                    tabs.forEachIndexed { index, label ->
                        val active = !useWebAppView && selectedTab == index
                        Surface(
                            shape = RoundedCornerShape(14.dp),
                            color = if (active) theme.accent.copy(alpha = 0.14f) else Color.Transparent,
                            modifier = Modifier.clickable {
                                useWebAppView = false
                                selectedTab = index
                            }
                        ) {
                            Text(
                                text = label,
                                fontSize = 12.sp,
                                fontWeight = if (active) FontWeight.ExtraBold else FontWeight.Medium,
                                color = if (active) theme.accent else theme.muted,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                            )
                        }
                    }
                }
            }
        }
    ) { innerPadding ->
        if (useWebAppView) {
            AndroidView(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                factory = { context ->
                    WebView(context).apply {
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = true
                        settings.mediaPlaybackRequiresUserGesture = false
                        webViewClient = WebViewClient()
                        webChromeClient = WebChromeClient()
                        loadUrl("https://radio-ueg-app.vercel.app")
                    }
                }
            )
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Co-Design Studio Interativo (quando aberto)
                if (showDesignStudio) {
                    Card(
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = theme.surface),
                        border = BorderStroke(1.dp, theme.accent.copy(alpha = 0.35f))
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "ESTÚDIO DE CO-DESIGN",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = theme.accent,
                                    letterSpacing = 1.sp,
                                    modifier = Modifier.weight(1f)
                                )
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = theme.elevated,
                                    modifier = Modifier.clickable { multiColorWaves = !multiColorWaves }
                                ) {
                                    Text(
                                        text = if (multiColorWaves) "Ondas: 5 Cores CriaLab" else "Ondas: Monocromático",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = theme.text,
                                        maxLines = 1,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                                    )
                                }
                            }

                            Row(
                                modifier = Modifier.horizontalScroll(rememberScrollState()),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                DESIGN_PRESETS.forEachIndexed { idx, preset ->
                                    val selected = idx == selectedPresetIndex
                                    Surface(
                                        shape = RoundedCornerShape(12.dp),
                                        color = preset.bg,
                                        border = BorderStroke(
                                            width = if (selected) 2.dp else 1.dp,
                                            color = if (selected) preset.accent else preset.text.copy(alpha = 0.15f)
                                        ),
                                        modifier = Modifier.clickable { selectedPresetIndex = idx }
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .size(10.dp)
                                                    .clip(CircleShape)
                                                    .background(preset.accent)
                                            )
                                            Text(
                                                text = preset.name,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = preset.text
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                when (selectedTab) {
                    0 -> LivePlayerSection(
                        theme = theme,
                        multiColorWaves = multiColorWaves,
                        isPlaying = isPlaying,
                        isBuffering = isBuffering,
                        streamStatus = streamStatus,
                        onTogglePlay = { toggleLiveStream() },
                        onOpenSchedule = { selectedTab = 1 }
                    )
                    1 -> ScheduleSection(theme = theme)
                    2 -> NewsSection(theme = theme)
                    else -> HubSection(
                        theme = theme,
                        onOpenWebChecklist = { useWebAppView = true }
                    )
                }
            }
        }
    }
}

@Composable
private fun LivePlayerSection(
    theme: DesignPreset,
    multiColorWaves: Boolean,
    isPlaying: Boolean,
    isBuffering: Boolean,
    streamStatus: String,
    onTogglePlay: () -> Unit,
    onOpenSchedule: () -> Unit
) {
    // Card Principal com Ondas da Logo Rádio UEG Educativa
    Card(
        shape = RoundedCornerShape(28.dp),
        colors = CardDefaults.cardColors(containerColor = theme.surface),
        border = BorderStroke(1.dp, theme.text.copy(alpha = 0.08f)),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Box(modifier = Modifier.fillMaxWidth()) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Status Pill + Qualidade Stream
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = RoundedCornerShape(50),
                        color = theme.elevated
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(if (isPlaying) CriaLabCoral else theme.accent)
                            )
                            Text(
                                text = if (isPlaying) "NO AR AO VIVO" else "STREAM OFICIAL ZENO.FM",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = theme.text,
                                letterSpacing = 1.sp
                            )
                        }
                    }

                    Text(
                        text = "AAC+ • Goiânia/Anápolis",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = theme.muted
                    )
                }

                // Programa Atual em Destaque
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(
                        text = "SINTONIA • REVISTA DO MEIO-DIA",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = theme.accent,
                        letterSpacing = 1.2.sp
                    )
                    Text(
                        text = "Rádio UEG Educativa Ao Vivo",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        color = theme.text
                    )
                    Text(
                        text = streamStatus,
                        fontSize = 13.sp,
                        color = theme.muted,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                // Equalizador de 38 Barras inspirado nas 19 ondas da logo Rádio UEG Educativa
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = theme.elevated,
                    border = BorderStroke(1.dp, theme.text.copy(alpha = 0.06f))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "ONDAS SONORAS • RÁDIO UEG",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = theme.muted,
                                letterSpacing = 1.1.sp,
                                modifier = Modifier.weight(1f)
                            )
                            Text(
                                text = if (isPlaying) "TRANSMITINDO" else "TOQUE PARA OUVIR",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = theme.accent,
                                maxLines = 1
                            )
                        }

                        SoundwaveEqualizerCompose(
                            isPlaying = isPlaying,
                            multiColor = multiColorWaves,
                            accentColor = theme.accent,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(64.dp)
                        )
                    }
                }

                // Botão Principal "Clicou, a Rádio está no ar"
                Button(
                    onClick = onTogglePlay,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(58.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isPlaying) CriaLabCoral else theme.accent,
                        contentColor = Color.White
                    )
                ) {
                    if (isBuffering) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(22.dp),
                            color = Color.White,
                            strokeWidth = 2.5.dp
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = "CONECTANDO AO STREAM...",
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 14.sp
                        )
                    } else {
                        Text(
                            text = if (isPlaying) "⏸ PAUSAR TRANSMISSÃO AO VIVO" else "▶ OUVIR RÁDIO AO VIVO AGORA",
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 15.sp,
                            letterSpacing = 0.5.sp
                        )
                    }
                }
            }
        }
    }

    // Próximos Programas da Grade
    Card(
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = theme.surface),
        border = BorderStroke(1.dp, theme.text.copy(alpha = 0.08f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "DESTAQUES DA GRADE 24H",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = theme.muted,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Ver grade completa →",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = theme.accent,
                    modifier = Modifier.clickable { onOpenSchedule() }
                )
            }

            SCHEDULE_ITEMS.take(4).forEach { item ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(theme.elevated)
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = item.time,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = item.badgeColor
                        )
                        Text(
                            text = item.title,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = theme.text
                        )
                        Text(
                            text = item.host,
                            fontSize = 12.sp,
                            color = theme.muted
                        )
                    }
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = item.badgeColor.copy(alpha = 0.15f)
                    ) {
                        Text(
                            text = item.category,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = item.badgeColor,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ScheduleSection(theme: DesignPreset) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = theme.surface),
        border = BorderStroke(1.dp, theme.text.copy(alpha = 0.08f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = "PROGRAMAÇÃO OFICIAL 24H • SEG A DOM",
                fontSize = 11.sp,
                fontWeight = FontWeight.ExtraBold,
                color = theme.accent,
                letterSpacing = 1.2.sp
            )
            Text(
                text = "Grade Rádio UEG Educativa",
                fontSize = 20.sp,
                fontWeight = FontWeight.Black,
                color = theme.text
            )

            SCHEDULE_ITEMS.forEach { item ->
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = theme.elevated,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = item.time,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = item.badgeColor
                            )
                            Text(
                                text = item.title,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = theme.text
                            )
                            Text(
                                text = item.host,
                                fontSize = 12.sp,
                                color = theme.muted
                            )
                        }
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = item.badgeColor.copy(alpha = 0.16f)
                        ) {
                            Text(
                                text = item.category,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = item.badgeColor,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun NewsSection(theme: DesignPreset) {
    val newsList = listOf(
        Triple(
            "UEG EM PAUTA",
            "CriaLab|UEG lança novo aplicativo da Rádio UEG Educativa com transmissão 24h",
            "Plataforma integra streaming Zeno.fm, grade interativa e produção acadêmica dos câmpus."
        ),
        Triple(
            "ENSINO & EXTENSÃO",
            "Programa Conversa com o Reitor destaca editais de pesquisa e bolsas estudantis",
            "Transmissão toda segunda-feira às 13h, com reprise às 18h na Rádio UEG."
        ),
        Triple(
            "CULTURA GOIANA",
            "Faixa das 20h reúne Rock Gyn, Ondas Negras e Fabular na programação",
            "Curadoria musical e literária valoriza artistas independentes do Cerrado."
        )
    )

    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        newsList.forEach { (tag, title, summary) ->
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = theme.surface),
                border = BorderStroke(1.dp, theme.text.copy(alpha = 0.08f))
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = tag,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = theme.accent,
                        letterSpacing = 1.2.sp
                    )
                    Text(
                        text = title,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = theme.text
                    )
                    Text(
                        text = summary,
                        fontSize = 13.sp,
                        color = theme.muted
                    )
                }
            }
        }
    }
}

@Composable
private fun HubSection(
    theme: DesignPreset,
    onOpenWebChecklist: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = theme.surface),
        border = BorderStroke(1.dp, theme.text.copy(alpha = 0.08f))
    ) {
        Column(
            modifier = Modifier.padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = "EXPEDIENTE & FICHA TÉCNICA • CRIALAB|UEG",
                fontSize = 11.sp,
                fontWeight = FontWeight.ExtraBold,
                color = theme.accent,
                letterSpacing = 1.2.sp
            )
            Text(
                text = "Universidade Estadual de Goiás",
                fontSize = 18.sp,
                fontWeight = FontWeight.Black,
                color = theme.text
            )
            Text(
                text = "• Reitor: Prof. Antonio Cruvinel\n" +
                    "• Coordenação CriaLab|UEG: Prof. Marcelo Costa\n" +
                    "• Direção Executiva & Editorial Rádio: Crami / Thaís Oliveira\n" +
                    "• Coordenação Técnica & App: Fernando\n" +
                    "• Redes Sociais & Conteúdo: Fernanda & Ezequiel",
                fontSize = 13.sp,
                color = theme.muted,
                lineHeight = 20.sp
            )

            OutlinedButton(
                onClick = onOpenWebChecklist,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text(
                    text = "Abrir Planilha Interativa da Equipe (Web App)",
                    fontWeight = FontWeight.Bold,
                    color = theme.accent
                )
            }
        }
    }
}

@Composable
fun RadioWaveLogoCompose(
    accentColor: Color,
    multiColor: Boolean,
    isAnimating: Boolean,
    modifier: Modifier = Modifier
) {
    val transition = rememberInfiniteTransition(label = "waveLogo")
    val phase by transition.animateFloat(
        initialValue = 0.75f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(700, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "wavePhase"
    )

    Canvas(
        modifier = modifier
            .width(54.dp)
            .height(28.dp)
    ) {
        val barCount = LOGO_WAVE_HEIGHTS.size
        val spacing = size.width / barCount
        val barWidth = spacing * 0.58f

        LOGO_WAVE_HEIGHTS.forEachIndexed { index, baseRatio ->
            val factor = if (isAnimating) {
                val mod = if (index % 2 == 0) phase else (1.9f - phase)
                (baseRatio * mod).coerceIn(0.18f, 1f)
            } else {
                baseRatio
            }
            val barHeight = size.height * factor
            val top = size.height - barHeight
            val color = if (multiColor) {
                CRIALAB_PALETTE[index % CRIALAB_PALETTE.size]
            } else {
                accentColor
            }

            drawRoundRect(
                color = color,
                topLeft = Offset(index * spacing, top),
                size = Size(barWidth, barHeight),
                cornerRadius = CornerRadius(barWidth / 2, barWidth / 2)
            )
        }
    }
}

@Composable
fun SoundwaveEqualizerCompose(
    isPlaying: Boolean,
    multiColor: Boolean,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    val transition = rememberInfiniteTransition(label = "equalizer")
    val animValue by transition.animateFloat(
        initialValue = 0.6f,
        targetValue = 1.25f,
        animationSpec = infiniteRepeatable(
            animation = tween(550, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "eqAnim"
    )

    val bars = remember { LOGO_WAVE_HEIGHTS + LOGO_WAVE_HEIGHTS.reversed() }

    Canvas(modifier = modifier) {
        val count = bars.size
        val step = size.width / count
        val barWidth = step * 0.55f

        bars.forEachIndexed { index, ratio ->
            val dynamicRatio = if (isPlaying) {
                val shift = when (index % 3) {
                    0 -> animValue
                    1 -> 1.85f - animValue
                    else -> (animValue + 0.9f) / 2f
                }
                (ratio * shift).coerceIn(0.15f, 1f)
            } else {
                ratio
            }

            val barHeight = size.height * dynamicRatio
            val top = (size.height - barHeight) / 2f
            val color = if (multiColor) {
                CRIALAB_PALETTE[index % CRIALAB_PALETTE.size]
            } else {
                accentColor
            }

            drawRoundRect(
                color = color.copy(alpha = if (isPlaying) 0.95f else 0.72f),
                topLeft = Offset(index * step, top),
                size = Size(barWidth, barHeight),
                cornerRadius = CornerRadius(barWidth / 2, barWidth / 2)
            )
        }
    }
}

@Preview(showBackground = true, showSystemUi = true, name = "HomeScreenPreview")
@Composable
fun HomeScreenPreview() {
    RadioUEGEducativaTheme {
        MainScreenContent(
            initialTab = 0,
            initialShowDesignStudio = true
        )
    }
}

@Preview(showBackground = true, showSystemUi = true, name = "Radio UEG - Branco Marfim")
@Composable
fun RadioUegHomePreview() {
    RadioUEGEducativaTheme {
        MainScreenContent(
            initialTab = 0,
            initialShowDesignStudio = true
        )
    }
}

@Preview(showBackground = true, name = "Radio UEG - Grade 24h")
@Composable
fun RadioUegSchedulePreview() {
    RadioUEGEducativaTheme {
        MainScreenContent(
            initialTab = 1,
            initialShowDesignStudio = false
        )
    }
}
