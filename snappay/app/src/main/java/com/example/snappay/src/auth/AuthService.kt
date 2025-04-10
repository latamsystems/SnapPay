package com.example.snappay.src.auth

import com.example.snappay.config.api.exeption.parseApiException
import com.example.snappay.config.api.ApiClient
import com.example.snappay.config.api.BaseResponse
import io.ktor.client.call.body
import io.ktor.client.statement.HttpResponse
import io.ktor.client.request.post
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.ServerResponseException
import io.ktor.client.request.get
import io.ktor.client.request.setBody
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess

object AuthService {
    suspend fun login(email: String, password: String): String = withContext(Dispatchers.IO) {
        try {
            val response: HttpResponse = ApiClient.client.post(ApiClient.getUrl("auth/login")) {
                setBody(LoginRequest(email, password))
                contentType(ContentType.Application.Json)
            }

            if (response.status.isSuccess()) {
                val body: BaseResponse<LoginData> = response.body()
                ApiClient.token = body.data.token
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

    suspend fun getUserDetails(): UserDetails = withContext(Dispatchers.IO) {
        val response = ApiClient.client.get(ApiClient.getUrl("auth/userDetails"))
        if (response.status.isSuccess()) {
            val body: BaseResponse<UserDetails> = response.body()
            return@withContext body.data
        } else {
            throw parseApiException(response)
        }
    }

    suspend fun logout(): String = withContext(Dispatchers.IO) {
        val response = ApiClient.client.get(ApiClient.getUrl("auth/logout"))
        if (response.status.isSuccess()) {
            ApiClient.token = null
            return@withContext "Sesión cerrada"
        } else {
            throw parseApiException(response)
        }
    }
}
