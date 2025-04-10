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
    var isLoading by mutableStateOf(false)
    private val _message = MutableStateFlow("")
    val message: StateFlow<String> = _message

    fun login(navigationToHome: () -> Unit) {
        if (email.isBlank() || password.isBlank()) {
            _message.value = "Completa todos los campos."
            return
        }

        viewModelScope.launch {
            isLoading = true
            try {
                val msg = AuthService.login(email, password)
                AuthService.getUserDetails()
                _message.value = msg
                navigationToHome()
            } catch (e: ApiException) {
                _message.value = e.message ?: "Error de autenticación"
            } catch (e: Exception) {
                _message.value = "Error inesperado: ${e.message}"
            } finally {
                isLoading = false
            }
        }
    }
}
