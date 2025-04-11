package com.example.snappay.src.junctions.sale_payment

import com.example.snappay.config.api.ApiClient
import com.example.snappay.config.api.GenericService

object Sale_PaymentService {
    suspend fun getBySaleId(saleId: Int): List<Sale_PaymentModel> {
        return GenericService.getAll(
            endpoint = "sale_payment",
            params = mapOf("filter[id_sale]" to saleId.toString())
        ) { data: Sale_PaymentData ->
            data.sale_payment
        }
    }

    suspend fun delete(id: Int) {
        GenericService.delete<Any>("sale_payment", id)
    }
}