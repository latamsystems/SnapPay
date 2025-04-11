package com.example.snappay.config.api

import com.example.snappay.config.api.exeption.parseApiException
import io.ktor.client.call.body
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object GenericService {

    suspend inline fun <reified T, reified D> getAll(
        endpoint: String,
        params: Map<String, String>? = null,
        crossinline mapper: (D) -> List<T>
    ): List<T> = withContext(Dispatchers.IO) {
        try {
            val response: HttpResponse = ApiClient.client.get(ApiClient.getUrl(endpoint)) {
                params?.forEach { (key, value) -> parameter(key, value) }
            }

            if (response.status.isSuccess()) {
                val base: BaseResponse<D> = response.body()
                return@withContext mapper(base.data as D)
            } else {
                throw parseApiException(response)
            }

        } catch (e: ClientRequestException) {
            throw parseApiException(e.response)
        } catch (e: ServerResponseException) {
            throw parseApiException(e.response)
        }
    }

    suspend inline fun <reified T, reified D> getById(
        endpoint: String,
        id: Int,
        crossinline mapper: (D) -> T
    ): T = withContext(Dispatchers.IO) {
        try {
            val response: HttpResponse = ApiClient.client.get(ApiClient.getUrl("$endpoint/$id"))
            if (response.status.isSuccess()) {
                val base: BaseResponse<D> = response.body()
                return@withContext mapper(base.data as D)
            } else {
                throw parseApiException(response)
            }
        } catch (e: ClientRequestException) {
            throw parseApiException(e.response)
        } catch (e: ServerResponseException) {
            throw parseApiException(e.response)
        }
    }

    suspend inline fun <reified T> post(endpoint: String, bodyData: T): BaseResponse<T> =
        withContext(Dispatchers.IO) {
            try {
                val response: HttpResponse = ApiClient.client.post(ApiClient.getUrl(endpoint)) {
                    contentType(ContentType.Application.Json)
                    setBody(bodyData)
                }

                if (response.status.isSuccess()) {
                    return@withContext response.body()
                } else {
                    throw parseApiException(response)
                }

            } catch (e: ClientRequestException) {
                throw parseApiException(e.response)
            } catch (e: ServerResponseException) {
                throw parseApiException(e.response)
            }
        }

    suspend inline fun <reified T> put(endpoint: String, id: Int, bodyData: T): BaseResponse<T> =
        withContext(Dispatchers.IO) {
            try {
                val response: HttpResponse = ApiClient.client.put(ApiClient.getUrl("$endpoint/$id")) {
                    contentType(ContentType.Application.Json)
                    setBody(bodyData)
                }

                if (response.status.isSuccess()) {
                    return@withContext response.body()
                } else {
                    throw parseApiException(response)
                }

            } catch (e: ClientRequestException) {
                throw parseApiException(e.response)
            } catch (e: ServerResponseException) {
                throw parseApiException(e.response)
            }
        }

    suspend inline fun <reified T> delete(endpoint: String, id: Int): BaseResponse<T> =
        withContext(Dispatchers.IO) {
            try {
                val response: HttpResponse = ApiClient.client.delete(ApiClient.getUrl("$endpoint/$id"))
                if (response.status.isSuccess()) {
                    return@withContext response.body()
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
