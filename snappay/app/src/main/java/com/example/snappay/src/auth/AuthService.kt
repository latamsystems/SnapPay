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

    /**
     * Login function to authenticate the user.
     * It sends a POST request to the server with the user's email and password.
     * If the login is successful, it stores the token in ApiClient and returns a success message.
     * If the login fails, it throws an ApiException with the error message.
     */
    suspend fun login(email: String, password: String): String = withContext(Dispatchers.IO) {
        try {
            val response: HttpResponse = ApiClient.client.post(ApiClient.getUrl("auth/login")) {
                setBody(LoginRequest(email, password))
                contentType(ContentType.Application.Json)
            }

            if (response.status.isSuccess()) {
                val body: BaseResponse<LoginData> = response.body()
                ApiClient.token = body.data?.token
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


    /**
     * Function to get user details.
     * It sends a GET request to the server to retrieve user details.
     * If the request is successful, it stores the user details in SessionManager and returns the user details.
     * If the request fails, it throws an ApiException with the error message.
     */
    suspend fun getUserDetails(): UserDetails = withContext(Dispatchers.IO) {
        val response = ApiClient.client.get(ApiClient.getUrl("auth/userDetails"))
        if (response.status.isSuccess()) {
            val body: BaseResponse<UserDetails> = response.body()
            SessionManager.setUser(body.data)
            return@withContext body.data as UserDetails
        } else {
            throw parseApiException(response)
        }
    }


    /**
     * Logout function to log out the user.
     * It sends a GET request to the server to log out the user.
     * If the logout is successful, it clears the token and user details from SessionManager.
     * If the logout fails, it throws an ApiException with the error message.
     */
    suspend fun logout(): String = withContext(Dispatchers.IO) {
        val response = ApiClient.client.get(ApiClient.getUrl("auth/logout"))
        if (response.status.isSuccess()) {
            ApiClient.token = null
            SessionManager.clearUser()
            return@withContext "Sesión cerrada"
        } else {
            throw parseApiException(response)
        }
    }

}
