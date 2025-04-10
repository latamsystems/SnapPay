package com.example.snappay.config.api

import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.headers
import io.ktor.http.HttpHeaders
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

object ApiClient {
    private const val BASE_URL = "https://snappay-rest.dudu.com.ec/api/v1"

    var token: String? = null // Token dinámico

    val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }

        install(DefaultRequest) {
            headers {
                token?.let {
                    append(HttpHeaders.Authorization, "Bearer $it")
                }
                append(HttpHeaders.ContentType, "application/json")
            }
        }
    }

    // Método para obtener la URL completa
    fun getUrl(path: String): String = "$BASE_URL/$path"

    // Método para verificar si el token ha expirado
    fun isTokenExpired(): Boolean {
        val token = token ?: return true
        val parts = token.split(".")
        if (parts.size < 2) return true

        val payload = String(android.util.Base64.decode(parts[1], android.util.Base64.DEFAULT))
        val expRegex = """"exp":(\d+)""".toRegex()
        val match = expRegex.find(payload) ?: return true

        val exp = match.groupValues[1].toLongOrNull() ?: return true
        val now = System.currentTimeMillis() / 1000

        return exp <= now
    }
}


//object ApiClient {
//
//    private const val BASE_URL = "https://snappay-rest.dudu.com.ec/api/v1"
//    private const val TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJmaXJzdG5hbWVfdXNlciI6IkFkbWluIiwibGFzdG5hbWVfdXNlciI6IlNpc3RlbWEiLCJpZF9yb2xlIjoxLCJpYXQiOjE3NDQyNDIzNzgsImV4cCI6MTc0NDI0NTk3OH0.BJ9xY-GSmnGXLkQa_Lypv6tZfADub-mi0g6jyr5TjdU"
//
//    val client = HttpClient(CIO) {
//        install(ContentNegotiation) {
//            json(Json { ignoreUnknownKeys = true })
//        }
//
//        install(DefaultRequest) {
//            headers {
//                append(HttpHeaders.Authorization, "Bearer $TOKEN")
//                append(HttpHeaders.ContentType, "application/json")
//            }
//        }
//    }
//
//    fun getUrl(path: String): String = "$BASE_URL/$path"
//}