package com.example.snappay.core.screen

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
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
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
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

    Box(modifier = Modifier
        .fillMaxSize()
        ) {
        clientState?.let {
            when {
                isLoading -> Box(Modifier.fillMaxSize(), Alignment.Center) {
                    CircularProgressIndicator()
                }

                error != null -> Box(Modifier.fillMaxSize(), Alignment.Center) {
                    Text("Error: $error", color = MaterialTheme.colorScheme.error)
                }

                pagos.none { it.payment != null } -> Box(Modifier.fillMaxSize(), Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.Pending,
                            contentDescription = "Sin pagos",
                            tint = Color.Gray,
                            modifier = Modifier.size(64.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            "No hay pagos disponibles",
                            style = MaterialTheme.typography.titleMedium.copy(color = Color.Gray)
                        )
                    }
                }

                else -> Column(
                    modifier = Modifier
                        .fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    pagos.forEach { pago ->
                        val payment = pago.payment ?: return@forEach
                        var dismissed by remember { mutableStateOf(false) }
                        var offsetX by remember { mutableStateOf(0f) }
                        var showConfirm by remember { mutableStateOf(false) }
                        var cardWidth by remember { mutableStateOf(1f) }

                        if (!dismissed) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .onGloballyPositioned {
                                        cardWidth = it.size.width.toFloat()
                                    }
                            ) {
                                // Fondo de eliminación
                                Box(
                                    modifier = Modifier
                                        .matchParentSize()
                                        .clip(RoundedCornerShape(16.dp))
                                        .background(Color(0x1BFBE9E7))
                                        .padding(end = 24.dp),
                                    contentAlignment = Alignment.CenterEnd
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Delete,
                                        contentDescription = "Eliminar",
                                        tint = Color(0xFFE53935),
                                        modifier = Modifier.size(28.dp)
                                    )
                                }

                                // Card principal
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
                                                    if (offsetX <= -cardWidth * 0.2f) {
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
                                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.onSecondary)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(16.dp)
                                    ) {
                                        // Status indicator en el fondo
                                        val statusColor = when (payment.id_status) {
                                            3 -> Color(0xFF4CAF50) // Paid - Green
                                            4 -> Color(0xFFFFA726) // Pending - Orange
                                            6 -> Color(0xFFF44336) // Rejected - Red
                                            else -> Color.Gray
                                        }

                                        // Icono grande en el fondo
                                        Icon(
                                            imageVector = if (!payment.media_payment.isNullOrBlank()) Icons.Default.Image
                                            else when (payment.id_status) {
                                                3 -> Icons.Default.CheckCircle
                                                4 -> Icons.Default.Pending
                                                6 -> Icons.Default.Warning
                                                else -> Icons.Default.Warning
                                            },
                                            contentDescription = null,
                                            tint = statusColor.copy(alpha = 0.3f),
                                            modifier = Modifier
                                                .size(45.dp)
                                                .align(Alignment.CenterEnd)
                                                .alpha(0.3f)
                                                .zIndex(0f)
                                        )

                                        // Número de documento flotante arriba a la derecha
                                        Box(
                                            modifier = Modifier
                                                .align(Alignment.TopEnd)
                                                .zIndex(2f)
                                                .clip(RoundedCornerShape(8.dp))
                                                .background(statusColor.copy(alpha = 0.1f))
                                                .padding(horizontal = 8.dp, vertical = 4.dp)
                                        ) {
                                            Text(
                                                text = "No. ${payment.numDocument_payment}",
                                                fontWeight = FontWeight.SemiBold,
                                                style = MaterialTheme.typography.labelMedium,
                                                color = statusColor
                                            )
                                        }

                                        // Fecha flotante abajo a la derecha
                                        Box(
                                            modifier = Modifier
                                                .align(Alignment.BottomEnd)
                                                .zIndex(2f)
                                                .clip(RoundedCornerShape(8.dp))
                                                .padding(horizontal = 8.dp)
                                        ) {
                                            Text(
                                                payment.created_at_payment.substringBefore("T"),
                                                style = MaterialTheme.typography.bodyMedium,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        }

                                        // Contenido principal
                                        Column(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .zIndex(1f),
                                            horizontalAlignment = Alignment.Start
                                        ) {
                                            // Amount with larger font
                                            Text(
                                                "\$${payment.value_payment}",
                                                style = MaterialTheme.typography.headlineMedium.copy(
                                                    fontWeight = FontWeight.Bold,
                                                    color = MaterialTheme.colorScheme.primary
                                                ),
                                                textAlign = TextAlign.Start
                                            )

                                            Spacer(modifier = Modifier.height(8.dp))

                                            // Date
                                            Text(
                                                "Pago de cuota #${payment.numQuota_payment}",
                                                style = MaterialTheme.typography.bodyMedium,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )

                                            Spacer(modifier = Modifier.height(10.dp))

                                            // Status text
                                            Row(
                                                verticalAlignment = Alignment.CenterVertically,
                                                modifier = Modifier
                                                    .clip(RoundedCornerShape(8.dp))
                                                    .background(statusColor.copy(alpha = 0.1f))
                                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                                            ) {
                                                Icon(
                                                    imageVector = when (payment.id_status) {
                                                        3 -> Icons.Default.CheckCircle
                                                        4 -> Icons.Default.Pending
                                                        6 -> Icons.Default.Warning
                                                        else -> Icons.Default.Warning
                                                    },
                                                    contentDescription = null,
                                                    tint = statusColor,
                                                    modifier = Modifier.size(16.dp)
                                                )
                                                Spacer(modifier = Modifier.width(4.dp))
                                                Text(
                                                    text = when (payment.id_status) {
                                                        3 -> "Pagado"
                                                        4 -> "Revisión"
                                                        6 -> "Rechazado"
                                                        else -> "Desconocido"
                                                    },
                                                    color = statusColor,
                                                    fontWeight = FontWeight.Medium,
                                                    style = MaterialTheme.typography.labelMedium
                                                )
                                            }

                                        }
                                    }
                                }

                                // Confirmación
                                if (showConfirm) {
                                    AlertDialog(
                                        onDismissRequest = {
                                            offsetX = 0f
                                            showConfirm = false
                                        },
                                        title = { Text("¿Eliminar pago?") },
                                        text = { Text("¿Estás seguro de que deseas eliminar este pago?") },
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
                    confirmButton = {
                        TextButton(onClick = { selectedImage = null }) {
                            Text("Cerrar")
                        }
                    },
                    text = {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(400.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color.Black.copy(alpha = 0.05f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Image(
                                painter = rememberAsyncImagePainter(imageUrl),
                                contentDescription = "Comprobante",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Fit
                            )
                        }
                    }
                )
            }
        } ?: NoAuthScreen()
    }
}
