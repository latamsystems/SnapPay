package com.example.snappay.src.auth

import com.example.snappay.src.core.sale.SaleModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

object SessionSaleManager {
    private val _sale = MutableStateFlow<SaleModel?>(null)
    val sale: StateFlow<SaleModel?> = _sale

    fun setSale(sale: SaleModel) {
        _sale.value = sale
    }

    fun clearSale() {
        _sale.value = null
    }

    fun isSaleAvailable(): Boolean = _sale.value != null
}