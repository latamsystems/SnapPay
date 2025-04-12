package com.example.snappay.core.screen

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.snappay.src.auth.SessionClientManager
import com.example.snappay.src.auth.SessionSaleManager
import com.example.snappay.src.common.NoAuthScreen

@Composable
fun HomeScreen() {
    val clientState by SessionClientManager.client.collectAsState()
    val saleState by SessionSaleManager.sale.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp, vertical = 24.dp),
        verticalArrangement = Arrangement.spacedBy(28.dp),
        horizontalAlignment = Alignment.Start
    ) {
        clientState?.let { client ->

            val firstName = client.firstname_client.split(" ").firstOrNull().orEmpty()
            val lastName = client.lastname_client.split(" ").firstOrNull().orEmpty()

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

            // Sección general
            SectionCard(
                title = "📱 Bienvenido a Snap Pay",
                subtitle = "Controla tu dispositivo, revisa cuotas, y mantente al tanto de tus pagos.",
                color = MaterialTheme.colorScheme.onSecondary
            )

            // Advertencia
            SectionCard(
                title = "⚠️ Advertencia importante",
                subtitle = "Desinstalar esta app será considerado una falta grave y podría generar una multa inmediata.",
                color = Color(0xFFFFEBEE),
                iconColor = Color(0xFFD32F2F),
                textColor = Color(0xFFD32F2F)
            )

            // Datos del cliente
            SectionCard(title = "🧾 Información del cliente") {
                InfoRow("Nombre", "${client.firstname_client} ${client.lastname_client}")
                InfoRow("Cédula", client.identification_client)
                InfoRow("Correo", client.email_client)
                InfoRow("Teléfono", client.phone_client)
            }

            // Datos de la compra
            saleState?.let { sale ->
                SectionCard(title = "📦 Información de la compra") {
                    InfoRow("IMEI", sale.imei_sale)
                    InfoRow("Cuotas totales", sale.fees_sale.toString())
                    InfoRow("Activación", sale.activation_at_sale.substringBefore("T"))
                    InfoRow("¿Tiene multa?", if (sale.isFine_sale) "Sí" else "No")
                }
            }

        } ?: NoAuthScreen()
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