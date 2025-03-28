package com.example.snappay

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json

class ApiService {
    private val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    private val baseUrl = "https://snappay-rest.dudu.com.ec/api/v1"
    private val token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJmaXJzdG5hbWVfdXNlciI6IkFkbWluIiwibGFzdG5hbWVfdXNlciI6IlNpc3RlbWEiLCJpZF9yb2xlIjoxLCJpYXQiOjE3NDMxMzA3MDcsImV4cCI6MTc0MzEzNDMwN30.jsUw5jDWUuv5e8f1WgZivw_Uyp6hBZ9TzKuhVzmaUAw"

    suspend fun getData(): String {
        val response: String = client.get("$baseUrl/user") {
            headers {
                append(HttpHeaders.Authorization, "Bearer $token")
            }
        }.body()
        return response
    }
}
