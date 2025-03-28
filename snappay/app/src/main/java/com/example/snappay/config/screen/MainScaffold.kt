import android.annotation.SuppressLint
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.snappay.core.navigation.*
import kotlinx.coroutines.launch
import kotlin.reflect.KClass

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScaffold() {
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val navController = rememberNavController()
    val currentBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = currentBackStackEntry?.destination?.route

    val screenConfigs = mapOf<KClass<*>, ScreenConfig>(
        Login::class to ScreenConfig(showTopBar = false, showBottomBar = false, showFab = false, showDrawer = false),
        Home::class to ScreenConfig(title = "Inicio"),
        Detail::class to ScreenConfig(title = "Detalle", showFab = false),
        Settings::class to ScreenConfig(title = "Ajustes", showBottomBar = false)
    )

    val routeKey = getRouteKey(currentDestination)
    val config = screenConfigs[routeKey] ?: ScreenConfig()

    // Cierra el drawer automáticamente al navegar
    LaunchedEffect(currentDestination) {
        if (drawerState.isOpen) {
            drawerState.close()
        }
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            if (config.showDrawer) {
                ModalDrawerSheet {
                    Text(
                        "Menú lateral",
                        style = MaterialTheme.typography.titleLarge,
                        modifier = Modifier.padding(16.dp)
                    )
                    NavigationDrawerItem(
                        label = { Text("Inicio") },
                        selected = routeKey == Home::class,
                        onClick = {
                            scope.launch {
                                drawerState.close()
                                navController.navigate(Home)
                            }
                        }
                    )
                    NavigationDrawerItem(
                        label = { Text("Detalle") },
                        selected = routeKey == Detail::class,
                        onClick = {
                            scope.launch {
                                drawerState.close()
                                navController.navigate(Detail("Desde Drawer"))
                            }
                        }
                    )
                }
            }
        }
    ) {
        Scaffold(
            topBar = {
                if (config.showTopBar) {
                    TopAppBar(
                        title = { Text(config.title) },
                        navigationIcon = {
                            IconButton(onClick = {
                                scope.launch { drawerState.open() }
                            }) {
                                Icon(Icons.Default.Menu, contentDescription = "Menú")
                            }
                        }
                    )
                }
            },
            bottomBar = {
                if (config.showBottomBar) {
                    NavigationBar {
                        NavigationBarItem(
                            icon = { Icon(Icons.Default.Home, contentDescription = "Inicio") },
                            label = { Text("Inicio") },
                            selected = routeKey == Home::class,
                            onClick = {
                                scope.launch {
                                    drawerState.close()
                                    navController.navigate(Home)
                                }
                            }
                        )
                        NavigationBarItem(
                            icon = { Icon(Icons.Default.Star, contentDescription = "Detalle") },
                            label = { Text("Detalle") },
                            selected = routeKey == Detail::class,
                            onClick = {
                                scope.launch {
                                    drawerState.close()
                                    navController.navigate(Detail("Desde Bottom Bar"))
                                }
                            }
                        )
                        NavigationBarItem(
                            icon = { Icon(Icons.Default.Settings, contentDescription = "Ajustes") },
                            label = { Text("Ajustes") },
                            selected = routeKey == Settings::class,
                            onClick = {
                                scope.launch {
                                    drawerState.close()
                                    navController.navigate(Settings(SettingInfo("Desde bottom bar", 475)))
                                }
                            }
                        )
                    }
                }
            },
            floatingActionButton = {
                if (config.showFab) {
                    FloatingActionButton(onClick = { /* Acción */ }) {
                        Icon(Icons.Default.Add, contentDescription = "Agregar")
                    }
                }
            }
        ) { innerPadding ->
            val scrollState = rememberScrollState()
            Column(
                modifier = Modifier
                    .verticalScroll(scrollState)
                    .padding(innerPadding)
            ) {
                NavigationWarper(navController)
            }
        }
    }
}

@Preview(showSystemUi = true)
@Composable
fun MainScaffoldPreview() {
    MainScaffold()
}

// Config por pantalla
data class ScreenConfig(
    val showTopBar: Boolean = true,
    val showBottomBar: Boolean = true,
    val showFab: Boolean = true,
    val showDrawer: Boolean = true,
    val title: String = "Snap Pay"
)

fun getRouteKey(route: String?): KClass<*>? {
    return when {
        route?.contains(Login::class.simpleName ?: "") == true -> Login::class
        route?.contains(Home::class.simpleName ?: "") == true -> Home::class
        route?.contains(Detail::class.simpleName ?: "") == true -> Detail::class
        route?.contains(Settings::class.simpleName ?: "") == true -> Settings::class
        else -> null
    }
}
