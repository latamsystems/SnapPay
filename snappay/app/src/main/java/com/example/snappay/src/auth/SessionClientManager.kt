package com.example.snappay.src.auth

import com.example.snappay.src.core.client.ClientModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

object SessionClientManager {
    private val _client = MutableStateFlow<ClientModel?>(null)
    val client: StateFlow<ClientModel?> = _client

    fun setClient(data: ClientModel?) {
        _client.value = data
    }

    fun clearClient() {
        _client.value = null
    }

    fun isLoggedIn(): Boolean = _client.value != null
}