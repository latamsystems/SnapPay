package com.example.snappay.core.screen

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.snappay.src.auth.SessionSaleManager
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun DatesScreen() {
    val saleState by SessionSaleManager.sale.collectAsState()

    val cuotas = remember(saleState) {
        saleState?.let { sale ->
            val cuotas = mutableListOf<Triple<Int, LocalDate, Int>>() // número, fecha, valor
            val formatter = DateTimeFormatter.ISO_DATE
            val startDate = LocalDate.parse(sale.activation_at_sale.substringBefore("T"), formatter)
            val cantidadCuotas = sale.fees_sale
            val valorTotal = sale.valPay_sale
            val valorCuota = if (cantidadCuotas > 0) valorTotal / cantidadCuotas else 0

            val diasIntervalo = when (sale.id_typeFees) {
                1 -> 7      // Semanal
                2 -> 15     // Quincenal
                3 -> 30     // Mensual
                else -> 30
            }

            for (i in 0 until cantidadCuotas) {
                val fecha = startDate.plusDays((i * diasIntervalo).toLong())
                cuotas.add(Triple(i + 1, fecha, valorCuota) as Triple<Int, LocalDate, Int>)
            }

            cuotas
        } ?: emptyList()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "🗓️ Fechas de pago",
            style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold)
        )

        cuotas.forEach { (numero, fecha, valor) ->
            val esPasado = fecha.isBefore(LocalDate.now())
            val backgroundColor = if (esPasado) Color(0xFFFFEBEE) else Color(0xFFE8F5E9)
            val textColor = if (esPasado) Color(0xFFD32F2F) else Color(0xFF388E3C)

            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                color = backgroundColor
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Cuota #$numero", fontWeight = FontWeight.SemiBold, color = textColor)
                    Text("Fecha: ${fecha.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))}", color = textColor)
                    Text("Valor: $${valor}", color = textColor)
                }
            }
        }
    }
}
