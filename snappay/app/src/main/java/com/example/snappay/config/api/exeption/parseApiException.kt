package com.example.snappay.config.api.exeption

import com.example.snappay.config.api.ErrorResponse
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import kotlinx.serialization.json.Json

suspend fun parseApiException(response: HttpResponse): ApiException {
    val json = response.bodyAsText()
    return try {
        val error = Json { ignoreUnknownKeys = true }.decodeFromString(ErrorResponse.serializer(), json)
        ApiException(error.msg, error)
    } catch (e: Exception) {
        ApiException("Error desconocido (${response.status})", null)
    }
}