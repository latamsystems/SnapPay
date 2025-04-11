package com.example.snappay.config.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.snappay.R
import com.example.snappay.src.auth.SessionManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppTopBar(
    title: String,
    scope: CoroutineScope,
    onMenuClick: suspend () -> Unit,
) {
    val isDark = isSystemInDarkTheme()
    val logoRes = if (isDark) R.drawable.logo_white else R.drawable.logo_black

    var logoClickCount by remember { mutableStateOf(0) }

    Surface(
        tonalElevation = 1.dp,
        shape = RoundedCornerShape(bottomStart = 20.dp, bottomEnd = 20.dp),
        shadowElevation = 1.dp,
        color = MaterialTheme.colorScheme.surface,
    ) {
        TopAppBar(
            modifier = Modifier.shadow(elevation = 4.dp),
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.surface,
                titleContentColor = MaterialTheme.colorScheme.onSurface,
                navigationIconContentColor = MaterialTheme.colorScheme.primary
            ),
            title = {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
                )
            },
            navigationIcon = {
                Image(
                    painter = painterResource(id = logoRes),
                    contentDescription = "Logo",
                    modifier = Modifier
                        .height(40.dp)
                        .padding(horizontal = 10.dp)
                        .clickable {
                            if (!SessionManager.isLoggedIn()){
                                logoClickCount++
                                if (logoClickCount >= 5) {
                                    scope.launch {
                                        onMenuClick()
                                        logoClickCount = 0
                                    }
                                }
                            } else {
                                scope.launch {
                                    onMenuClick()
                                }
                            }
                        }

                )
            }
        )
    }
}
