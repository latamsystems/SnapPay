package com.example.snappay.config.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.res.painterResource
import com.example.snappay.R

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppTopBar(
    title: String,
    scope: CoroutineScope,
    showDrawer: Boolean,
    onMenuClick: suspend () -> Unit,
) {
    val isDark = isSystemInDarkTheme()
    val logoRes = if (isDark) R.drawable.logo_white else R.drawable.logo_black

    Surface(
        tonalElevation = 1.dp,
        shape = RoundedCornerShape(bottomStart = 20.dp, bottomEnd = 20.dp),
        shadowElevation = 1.dp,
        color = MaterialTheme.colorScheme.surface,
    ) {
        TopAppBar(
            modifier = Modifier
                .shadow(elevation = 4.dp),
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
                if (showDrawer) {
                    IconButton(onClick = {
                        scope.launch { onMenuClick() }
                    }) {
                        Icon(
                            imageVector = Icons.Default.Menu,
                            contentDescription = "Menú"
                        )
                    }
                } else {
                    Image(
                        painter = painterResource(id = logoRes),
                        contentDescription = "Logo",
                        modifier = Modifier
                            .height(40.dp)
                            .padding(horizontal = 10.dp)
                    )
                }
            }
        )
    }
}
