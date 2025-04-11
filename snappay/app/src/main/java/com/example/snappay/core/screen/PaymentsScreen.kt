package com.example.snappay.core.screen

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Pending
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.rememberAsyncImagePainter
import com.example.snappay.src.auth.SessionClientManager
import com.example.snappay.src.common.NoAuthScreen
import com.example.snappay.src.junctions.sale_payment.PaymentsViewModel
import com.example.snappay.src.junctions.sale_payment.Sale_PaymentService
import kotlinx.coroutines.launch

@Composable
fun PaymentsScreen(viewModel: PaymentsViewModel = viewModel()) {
    val context = LocalContext.current
    val clientState by SessionClientManager.client.collectAsState()
    val pagos by viewModel.pagos.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()
    var selectedImage by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        viewModel.loadPayments()
    }

    Box(modifier = Modifier.fillMaxSize()) {
        clientState?.let {
            when {
                isLoading -> Box(Modifier.fillMaxSize(), Alignment.Center) {
                    CircularProgressIndicator()
                }

                error != null -> Box(Modifier.fillMaxSize(), Alignment.Center) {
                    Text("Error: $error", color = MaterialTheme.colorScheme.error)
                }

                pagos.isEmpty() -> Box(Modifier.fillMaxSize(), Alignment.Center) {
                    Text("No hay pagos aún.")
                }

                else -> Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    pagos.forEach { pago ->
                        val payment = pago.payment ?: return@forEach
                        var dismissed by remember { mutableStateOf(false) }
                        var offsetX by remember { mutableStateOf(0f) }
                        var showConfirm by remember { mutableStateOf(false) }

                        if (!dismissed) {
                            var cardWidth by remember { mutableStateOf(1f) } // para evitar división por cero

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .onGloballyPositioned {
                                        cardWidth = it.size.width.toFloat()
                                    }
                            ) {
                                // Fondo con ícono de basura
                                Box(
                                    modifier = Modifier
                                        .matchParentSize()
                                        .padding(end = 24.dp),
                                    contentAlignment = Alignment.CenterEnd
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Delete,
                                        contentDescription = "Eliminar",
                                        tint = Color.Red,
                                        modifier = Modifier.size(32.dp)
                                    )
                                }

                                // Card deslizante
                                Card(
                                    modifier = Modifier
                                        .offset(x = offsetX.dp)
                                        .fillMaxWidth()
                                        .pointerInput(payment.id_payment) {
                                            detectHorizontalDragGestures(
                                                onHorizontalDrag = { _, dragAmount ->
                                                    if (payment.id_status == 4) {
                                                        offsetX = (offsetX + dragAmount).coerceAtMost(0f)
                                                    }
                                                },
                                                onDragEnd = {
                                                    val threshold = -cardWidth * 0.2f // antes era 0.8f
                                                    if (offsetX <= threshold) {
                                                        showConfirm = true
                                                    } else {
                                                        offsetX = 0f
                                                    }

                                                }
                                            )
                                        }
                                        .clickable {
                                            if (!payment.media_payment.isNullOrBlank()) {
                                                selectedImage = payment.media_payment
                                            }
                                        },
                                    shape = RoundedCornerShape(16.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainer),
                                    elevation = CardDefaults.cardElevation(4.dp)
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(16.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(
                                            modifier = Modifier.weight(1f),
                                            verticalArrangement = Arrangement.spacedBy(4.dp)
                                        ) {
                                            Text(
                                                "Documento: ${payment.numDocument_payment}",
                                                fontWeight = FontWeight.SemiBold
                                            )
                                            Text("Valor: \$${payment.value_payment}")
                                            Text("Fecha: ${payment.created_at_payment.substringBefore("T")}")
                                            Text(
                                                text = when (payment.id_status) {
                                                    3 -> "✅ Pagado"
                                                    4 -> "⏳ Pendiente"
                                                    6 -> "❌ Rechazado"
                                                    else -> "Desconocido"
                                                },
                                                color = when (payment.id_status) {
                                                    3 -> Color(0xFF4CAF50)
                                                    4 -> Color(0xFFFFC107)
                                                    6 -> Color(0xFFF44336)
                                                    else -> Color.Gray
                                                }
                                            )
                                        }

                                        Icon(
                                            imageVector = if (!payment.media_payment.isNullOrBlank()) Icons.Default.Image
                                            else when (payment.id_status) {
                                                3 -> Icons.Default.CheckCircle
                                                4 -> Icons.Default.Pending
                                                6 -> Icons.Default.Warning
                                                else -> Icons.Default.Warning
                                            },
                                            contentDescription = null,
                                            tint = when (payment.id_status) {
                                                3 -> Color(0xFF4CAF50)
                                                4 -> Color(0xFFFFC107)
                                                6 -> Color(0xFFF44336)
                                                else -> Color.Gray
                                            },
                                            modifier = Modifier
                                                .size(28.dp)
                                                .padding(start = 8.dp)
                                        )
                                    }
                                }

                                // Confirmación de eliminación
                                if (showConfirm) {
                                    AlertDialog(
                                        onDismissRequest = {
                                            offsetX = 0f
                                            showConfirm = false
                                        },
                                        title = { Text("¿Eliminar pago?") },
                                        text = { Text("¿Estás seguro de que deseas eliminar este pago pendiente?") },
                                        confirmButton = {
                                            TextButton(onClick = {
                                                scope.launch {
                                                    try {
                                                        Sale_PaymentService.delete(pago.id_sale_payment)
                                                        dismissed = true
                                                        Toast.makeText(context, "Pago eliminado correctamente", Toast.LENGTH_SHORT).show()
                                                    } catch (e: Exception) {
                                                        Toast.makeText(context, "Error al eliminar: ${e.message}", Toast.LENGTH_SHORT).show()
                                                        offsetX = 0f
                                                    } finally {
                                                        showConfirm = false
                                                    }
                                                }
                                            }) {
                                                Text("Eliminar", color = Color.Red)
                                            }
                                        },
                                        dismissButton = {
                                            TextButton(onClick = {
                                                offsetX = 0f
                                                showConfirm = false
                                            }) {
                                                Text("Cancelar")
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    }


                }
            }

            // Imagen ampliada
            selectedImage?.let { imageUrl ->
                AlertDialog(
                    onDismissRequest = { selectedImage = null },
                    confirmButton = {},
                    text = {
                        Image(
                            painter = rememberAsyncImagePainter(imageUrl),
                            contentDescription = "Comprobante",
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(400.dp)
                        )
                    }
                )
            }
        } ?: NoAuthScreen()
    }
}

