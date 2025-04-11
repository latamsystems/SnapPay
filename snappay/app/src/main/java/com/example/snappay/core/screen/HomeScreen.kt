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
import androidx.compose.ui.res.painterResource
import com.example.snappay.R
import com.example.snappay.src.common.NoAuthScreen

@Composable
fun HomeScreen() {
    val clientState by SessionClientManager.client.collectAsState()
    val saleState by SessionSaleManager.sale.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp),
        horizontalAlignment = Alignment.Start
    ) {
        clientState?.let { client ->

            // Obtener primer nombre y apellido
            val firstName = client.firstname_client.split(" ").firstOrNull().orEmpty()
            val lastName = client.lastname_client.split(" ").firstOrNull().orEmpty()

            // Bienvenida personalizada grande
            Text(
                text = "¡Hola $firstName $lastName 👋!",
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            )

            // Sección de información general
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(4.dp, RoundedCornerShape(12.dp)),
                shape = RoundedCornerShape(12.dp),
                color = MaterialTheme.colorScheme.surfaceVariant
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("📱 Bienvenido a Snap Pay", fontWeight = FontWeight.SemiBold, fontSize = 18.sp)
                    Spacer(modifier = Modifier.height(10.dp))
                    Text("Esta app te permite controlar y pagar tu dispositivo.")
                    Text("Verifica tus cuotas, pagos pendientes y recibe alertas de vencimiento.")
                }
            }

            // Advertencia llamativa
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(2.dp, RoundedCornerShape(12.dp)),
                shape = RoundedCornerShape(12.dp),
                color = Color(0xFFFFEBEE) // rojo claro
            ) {
                Column(
                    modifier = Modifier
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Warning, contentDescription = null, tint = Color(0xFFD32F2F))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Importante", fontWeight = FontWeight.Bold, color = Color(0xFFD32F2F))
                    }
                    Text(
                        "Si desinstalas esta app, se considerará una falta grave y podrías recibir una multa inmediata.",
                        color = Color(0xFFD32F2F),
                        fontSize = 14.sp
                    )
                }
            }

            // Información del cliente con diseño moderno
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(3.dp, RoundedCornerShape(16.dp)),
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.onSecondary
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        "🧾 Información del cliente",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    InfoRow(label = "Nombre", value = "${client.firstname_client} ${client.lastname_client}")
                    InfoRow(label = "Cédula", value = client.identification_client)
                    InfoRow(label = "Correo", value = client.email_client)
                    InfoRow(label = "Teléfono", value = client.phone_client)
                }
            }

            // Información de la compra
            saleState?.let { sale ->
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .shadow(3.dp, RoundedCornerShape(16.dp)),
                    shape = RoundedCornerShape(16.dp),
                    color = MaterialTheme.colorScheme.onTertiary
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(
                            "📦 Información de la compra",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )

                        InfoRow(label = "IMEI", value = sale.imei_sale)
                        InfoRow(label = "Cuotas totales", value = sale.fees_sale.toString())
                        InfoRow(label = "Fecha de activación", value = sale.activation_at_sale.substringBefore("T"))
                        InfoRow(label = "¿Tiene multa?", value = if (sale.isFine_sale) "Sí" else "No")
                    }
                }
            }


        } ?: run {
            NoAuthScreen()
        }
    }
}

@Composable
fun InfoRow(label: String, value: String) {
    Column {
        Text(label, fontSize = 13.sp, color = MaterialTheme.colorScheme.primary)
        Text(value, fontSize = 15.sp, fontWeight = FontWeight.Medium)
    }
}

@Preview(showBackground = true)
@Composable
fun HomeScreenPreview() {
    HomeScreen()
}