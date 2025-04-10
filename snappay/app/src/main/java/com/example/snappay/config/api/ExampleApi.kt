package com.example.snappay.config.api

import com.example.snappay.config.api.exeption.parseApiException
import com.example.snappay.src.core.client.ClientData
import com.example.snappay.src.core.client.ClientModel
import io.ktor.client.call.body
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.ServerResponseException
import io.ktor.client.request.get
import io.ktor.client.statement.HttpResponse
import io.ktor.http.isSuccess
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ExampleApi {

    suspend fun getClients(): List<ClientModel> = withContext(Dispatchers.IO) {
        try {
            val response: HttpResponse = ApiClient.client.get(ApiClient.getUrl("client"))

            if (response.status.isSuccess()) {
                val base: BaseResponse<ClientData> = response.body()
                return@withContext base.data.client
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