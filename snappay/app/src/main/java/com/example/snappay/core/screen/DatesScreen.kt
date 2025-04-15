package com.example.snappay.core.screen

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Pending
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.snappay.src.auth.SessionSaleManager
import com.example.snappay.src.junctions.sale_payment.PaymentsViewModel
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun DatesScreen(viewModel: PaymentsViewModel = viewModel()) {
    val saleState by SessionSaleManager.sale.collectAsState()
    val pagos by viewModel.pagos.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    val cuotas = remember(saleState, pagos) {
        saleState?.let { sale ->
            val cuotas = mutableListOf<CuotaInfo>()
            val formatter = DateTimeFormatter.ISO_DATE
            val startDate = LocalDate.parse(sale.activation_at_sale.substringBefore("T"), formatter)
            val cantidadCuotas = sale.fees_sale
            val valorTotal = sale.valPay_sale
            val valorCuota = if (cantidadCuotas > 0) valorTotal / cantidadCuotas else 0.0

            val diasIntervalo = when (sale.id_typeFees) {
                1 -> 7
                2 -> 15
                3 -> 30
                else -> 30
            }

            for (i in 0 until cantidadCuotas) {
                val numero = i + 1
                val fecha = startDate.plusDays((i * diasIntervalo).toLong())
                val pagoRelacionado = pagos.find { it.payment?.numQuota_payment == numero }

                val estado = when (pagoRelacionado?.payment?.id_status) {
                    3 -> "Pagado"
                    4 -> "Revisión"
                    else -> "Sin pagar"
                }

                if (estado != "Rechazado") {
                    cuotas.add(CuotaInfo(numero, fecha, valorCuota, estado))
                }
            }

            cuotas
        } ?: emptyList()
    }

    LaunchedEffect(Unit) {
        viewModel.loadPayments()
    }

    Column(
        modifier = Modifier
            .fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(5.dp)
    ) {
        // Título
        Text(
            text = "Calendario de pagos",
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.primary
        )

        // Subtítulo informativo
        Text(
            text = "Consulta tus fechas y estados de pago de forma clara y organizada.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(8.dp))

        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            cuotas.forEach { cuota ->
                val esPasado = cuota.fecha.isBefore(LocalDate.now())

                val estadoColor = when (cuota.estado) {
                    "Pagado" -> Color(0xFF4CAF50)
                    "Revisión" -> Color(0xFFFFA726)
                    "Sin pagar" -> if (esPasado) Color(0xFFE53935) else MaterialTheme.colorScheme.secondaryContainer
                    else -> MaterialTheme.colorScheme.primary
                }

                // Color de fondo basado en el estado y si está vencido
                val backgroundColor = when (cuota.estado) {
                    "Pagado" -> MaterialTheme.colorScheme.surface
                    "Revisión" -> MaterialTheme.colorScheme.surface
                    "Sin pagar" -> if (esPasado) MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surface
                    else -> MaterialTheme.colorScheme.surface
                }

                // Diseño simple de lista en lugar de tarjetas
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            color = backgroundColor,
                            shape = RoundedCornerShape(8.dp)
                        )
                        .border(
                            width = 1.dp,
                            color = if (cuota.estado == "Sin pagar" && esPasado)
                                Color(0xFFE53935).copy(alpha = 0.5f)
                            else
                                MaterialTheme.colorScheme.outlineVariant,
                            shape = RoundedCornerShape(8.dp)
                        )
                        .padding(15.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Número de cuota con círculo o icono según estado
                    // Número de cuota con círculo o icono según estado
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .background(estadoColor, RoundedCornerShape(18.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        when (cuota.estado) {
                            "Pagado" -> Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(25.dp)
                            )
                            "Revisión" -> Icon(
                                imageVector = Icons.Default.Pending,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(25.dp)
                            )
                            "Sin pagar" -> if (esPasado) {
                                Icon(
                                    imageVector = Icons.Default.Warning,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(30.dp)
                                )
                            } else {
                                Text(
                                    text = "${cuota.numero}",
                                    color = MaterialTheme.colorScheme.onSecondaryContainer,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            else -> Text(
                                text = "${cuota.numero}",
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }


                    // Información principal
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .padding(start = 12.dp)
                    ) {
                        Text(
                            text = "${cuota.fecha.format(DateTimeFormatter.ofPattern("dd MMM yyyy"))}",
                            style = MaterialTheme.typography.bodyMedium,
                            fontSize = 20.sp,
                            color = if (cuota.estado == "Sin pagar" && esPasado)
                                MaterialTheme.colorScheme.error
                            else
                                MaterialTheme.colorScheme.onSurface
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(
                                    if (cuota.estado == "Sin pagar" && !esPasado)
                                        MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.3f)
                                    else
                                        estadoColor.copy(alpha = 0.1f)
                                )
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "$ ${"%.2f".format(cuota.valor)}",
                                fontWeight = FontWeight.SemiBold,
                                style = MaterialTheme.typography.labelMedium,
                                color = if (cuota.estado == "Sin pagar" && !esPasado)
                                    MaterialTheme.colorScheme.onSecondaryContainer
                                else
                                    estadoColor,
                                fontSize = 16.sp
                            )
                        }
                    }

                    Column(
                        horizontalAlignment = Alignment.End
                    ) {
                        // Estado
                        Text(
                            text = cuota.estado,
                            color = if (cuota.estado == "Sin pagar" && !esPasado)
                                MaterialTheme.colorScheme.onSecondaryContainer
                            else
                                estadoColor,
                            fontWeight = FontWeight.Medium,
                            style = MaterialTheme.typography.labelMedium,
                            fontSize = 12.sp,
                            textAlign = TextAlign.End,
                            modifier = Modifier
                                .padding(start = 8.dp, end = 8.dp)
                                .align(Alignment.End)
                        )


                        // Mensaje de vencido para pagos sin pagar y pasados
                        if (cuota.estado == "Sin pagar" && esPasado) {
                            Text(
                                text = "¡Pago vencido!",
                                color = MaterialTheme.colorScheme.error,
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Medium,
                                fontSize = 12.sp,
                                textAlign = TextAlign.End,
                                modifier = Modifier
                                    .padding(start = 8.dp, end = 8.dp)
                                    .align(Alignment.End)
                            )
                        }
                    }

                }

                Spacer(modifier = Modifier.height(4.dp))
            }
        }
    }
}

data class CuotaInfo(
    val numero: Int,
    val fecha: LocalDate,
    val valor: Double,
    val estado: String
)