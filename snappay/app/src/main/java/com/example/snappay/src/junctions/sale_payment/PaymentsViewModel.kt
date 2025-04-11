package com.example.snappay.src.junctions.sale_payment

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.snappay.src.auth.SessionSaleManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class PaymentsViewModel : ViewModel() {
    private val _pagos = MutableStateFlow<List<Sale_PaymentModel>>(emptyList())
    val pagos: StateFlow<List<Sale_PaymentModel>> = _pagos

    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    fun loadPayments() {
        val id = SessionSaleManager.sale.value?.id_sale ?: return
        _isLoading.value = true
        viewModelScope.launch {
            try {
                _pagos.value = Sale_PaymentService.getBySaleId(id)
            } catch (e: Exception) {
                _error.value = e.message
            } finally {
                _isLoading.value = false
            }
        }
    }
}