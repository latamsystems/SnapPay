package com.example.snappay.src.core.client

import com.example.snappay.config.api.ApiClient
import com.example.snappay.config.api.BaseResponse
import com.example.snappay.config.api.exeption.parseApiException
import com.example.snappay.src.admin.settings.ClientSyncModel
import io.ktor.client.call.body
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.ServerResponseException
import io.ktor.client.request.put
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object ClientService {
    suspend fun syncClient(data: ClientSyncModel): String = withContext(Dispatchers.IO) {
        try {
            val response = ApiClient.client.put(ApiClient.getUrl("client/sync")) {
                contentType(ContentType.Application.Json)
                setBody(data)
            }

            if (response.status.isSuccess()) {
                val body: BaseResponse<String> = response.body()
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