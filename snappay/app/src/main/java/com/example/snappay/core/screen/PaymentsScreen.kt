package com.example.snappay.core.screen

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.snappay.src.auth.SessionSaleManager
import com.example.snappay.src.junctions.sale_payment.Sale_PaymentModel
import com.example.snappay.src.junctions.sale_payment.Sale_PaymentService

@Composable
fun PaymentsScreen() {
    val sale by SessionSaleManager.sale.collectAsState()
    val scope = rememberCoroutineScope()

    var pagos by remember { mutableStateOf<List<Sale_PaymentModel>>(emptyList()) }
    var error by remember { mutableStateOf<String?>(null) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(sale?.id_sale) {
        sale?.id_sale?.let { id ->
            isLoading = true
            try {
                pagos = Sale_PaymentService.getBySaleId(id)
            } catch (e: Exception) {
                error = e.message
            } finally {
                isLoading = false
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "💸 Pagos realizados",
            style = MaterialTheme.typography.titleLarge
        )

        when {
            isLoading -> {
                CircularProgressIndicator()
            }
            error != null -> {
                Text("❌ Error: $error", color = MaterialTheme.colorScheme.error)
            }
            pagos.isEmpty() -> {
                Text("No hay pagos aún.")
            }
            else -> {
                pagos.forEach { pago ->
                    pago.payment?.let { p ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                        ) {
                            Column(Modifier.padding(16.dp)) {
                                Text("Documento: ${p.numDocument_payment}", style = MaterialTheme.typography.bodyMedium)
                                Text("Valor: \$${p.value_payment}")
                                Text("Fecha: ${p.created_at_payment.substringBefore("T")}")
                            }
                        }
                    }
                }
            }
        }
    }
}
