package com.example.snappay.src.auth

import com.example.snappay.config.api.ApiClient
import com.example.snappay.config.api.BaseResponse
import com.example.snappay.config.api.exeption.parseApiException
import com.example.snappay.src.core.sale.SaleDataWarper
import io.ktor.client.call.body
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object ClientAuthService {
    suspend fun loginWithFid(fid: String = "IHM0jZTIfHUdl54B7pPK6hR9tP02"): String = withContext(
        Dispatchers.IO) {
        try {
            val response = ApiClient.client.get(ApiClient.getUrl("sale/firebase/$fid")) {
                contentType(ContentType.Application.Json)
            }

            if (response.status.isSuccess()) {
                val body: BaseResponse<SaleDataWarper> = response.body()
                body.data?.let {
                    SessionSaleManager.setSale(it.sale)
                    SessionClientManager.setClient(it.sale.client)
                }
                return@withContext body.msg
            } else {
                throw parseApiException(response)
            }
        } catch (e: ClientRequestException) {
            throw parseApiException(e.response)
        } catch (e: ServerResponseException) {
            throw parseApiException(e.response)
        }
    }
}