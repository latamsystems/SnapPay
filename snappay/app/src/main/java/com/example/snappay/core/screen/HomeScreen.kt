package com.example.snappay.core.screen

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.snappay.src.auth.ClientAuthService
import com.example.snappay.src.auth.SessionClientManager
import com.example.snappay.src.auth.SessionSaleManager
import com.example.snappay.src.common.NoAuthScreen

@Composable
fun HomeScreen() {
    val clientState by SessionClientManager.client.collectAsState()
    val saleState by SessionSaleManager.sale.collectAsState()

    var isInitializing by remember { mutableStateOf(true) }
    val context = LocalContext.current

    // Ejecutar solo al montar
    LaunchedEffect(Unit) {
        try {
            ClientAuthService.loginWithFid() // <- Aquí puedes usar un FID real si deseas
        } catch (e: Exception) {
            // Error controlado, se mostrará NoAuthScreen más abajo
        } finally {
            isInitializing = false
        }
    }

    when {
        isInitializing -> {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        }

        clientState == null || saleState == null -> {
            NoAuthScreen()
        }

        else -> {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 20.dp, vertical = 24.dp),
                verticalArrangement = Arrangement.spacedBy(28.dp),
                horizontalAlignment = Alignment.Start
            ) {
                val firstName = clientState!!.firstname_client.split(" ").firstOrNull().orEmpty()
                val lastName = clientState!!.lastname_client.split(" ").firstOrNull().orEmpty()

                Text(
                    text = "👋 ¡Hola $firstName $lastName!",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                )

                Text(
                    text = "Te damos la bienvenida a tu espacio de gestión de pagos. Aquí puedes verificar el estado de tu equipo, consultar cuotas y estar al tanto de cualquier novedad.",
                    style = MaterialTheme.typography.bodyMedium.copy(color = MaterialTheme.colorScheme.onSurfaceVariant),
                    modifier = Modifier.padding(end = 12.dp)
                )

                SectionCard(
                    title = "📱 Bienvenido a Snap Pay",
                    subtitle = "Controla tu dispositivo, revisa cuotas, y mantente al tanto de tus pagos.",
                    color = MaterialTheme.colorScheme.onSecondary
                )

                SectionCard(
                    title = "⚠️ Advertencia importante",
                    subtitle = "Desinstalar esta app será considerado una falta grave y podría generar una multa inmediata.",
                    color = Color(0xFFFFEBEE),
                    iconColor = Color(0xFFD32F2F),
                    textColor = Color(0xFFD32F2F)
                )

                SectionCard(title = "🧾 Información del cliente") {
                    InfoRow("Nombre", "${clientState!!.firstname_client} ${clientState!!.lastname_client}")
                    InfoRow("Cédula", clientState!!.identification_client)
                    InfoRow("Correo", clientState!!.email_client)
                    InfoRow("Teléfono", clientState!!.phone_client)
                }

                SectionCard(title = "📦 Información de la compra") {
                    InfoRow("IMEI", saleState!!.imei_sale)
                    InfoRow("Cuotas totales", "${saleState!!.fees_sale} ${saleState!!.typeFees?.name_typeFees}")
                    InfoRow("Activación", saleState!!.activation_at_sale.substringBefore("T"))
                    InfoRow("¿Tiene multa?", if (saleState!!.isFine_sale) "Sí" else "No")
                }
            }
        }
    }
}

@Composable
fun InfoRow(label: String, value: String) {
    Column(modifier = Modifier.padding(vertical = 4.dp)) {
        Text(label, fontSize = 13.sp, color = MaterialTheme.colorScheme.primary)
        Text(value, fontSize = 15.sp, fontWeight = FontWeight.Medium)
    }
}

@Composable
fun SectionCard(
    title: String,
    subtitle: String? = null,
    color: Color = MaterialTheme.colorScheme.onSecondary,
    iconColor: Color = MaterialTheme.colorScheme.primary,
    textColor: Color = MaterialTheme.colorScheme.onSurface,
    content: @Composable (ColumnScope.() -> Unit)? = null
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(3.dp, RoundedCornerShape(16.dp)),
        shape = RoundedCornerShape(16.dp),
        color = color
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = iconColor
                )
            }

            subtitle?.let {
                Text(
                    text = it,
                    fontSize = 14.sp,
                    color = textColor
                )
            }

            content?.invoke(this)
        }
    }
}


@Preview(showBackground = true)
@Composable
fun HomeScreenPreview() {
    HomeScreen()
}