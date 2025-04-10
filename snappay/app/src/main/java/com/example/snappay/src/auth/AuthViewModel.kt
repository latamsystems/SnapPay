package com.example.snappay.src.auth

import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.snappay.config.api.exeption.ApiException
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class AuthViewModel : ViewModel() {
    var email by mutableStateOf("")
    var password by mutableStateOf("")
    private val _message = MutableStateFlow("")
    val message: StateFlow<String> = _message

    fun login(navigationToHome: () -> Unit) {
        viewModelScope.launch {
            try {
                val msg = AuthService.login(email, password)
                _message.value = msg
                navigationToHome()
            } catch (e: ApiException) {
                _message.value = "Error: ${e.message}"
            } catch (e: Exception) {
                _message.value = "Error inesperado: ${e.message}"
            }
        }
    }
}
