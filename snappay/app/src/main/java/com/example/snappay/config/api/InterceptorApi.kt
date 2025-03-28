package com.example.snappay.config.api

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.headers
import io.ktor.http.HttpHeaders
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

class InterceptorApi {
    private val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    private val baseUrl = "https://snappay-rest.dudu.com.ec/api/v1"
    private val token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJmaXJzdG5hbWVfdXNlciI6IkFkbWluIiwibGFzdG5hbWVfdXNlciI6IlNpc3RlbWEiLCJpZF9yb2xlIjoxLCJpYXQiOjE3NDMxNDU4OTcsImV4cCI6MTc0MzE0OTQ5N30.ovvmtXEb5LB1FGCFqxEN0o_Tqy2XANtSwf3bs-kup4Y"

    suspend fun getData(): String {
        val response: String = client.get("$baseUrl/user") {
            headers {
                append(HttpHeaders.Authorization, "Bearer $token")
            }
        }.body()
        return response
    }
}
