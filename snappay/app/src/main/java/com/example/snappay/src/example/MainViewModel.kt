package com.example.snappay.src.example

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.snappay.config.api.GenericService
import com.example.snappay.config.api.ExampleApi
import com.example.snappay.config.api.exeption.ApiException
import com.example.snappay.src.core.user.UserData
import com.example.snappay.src.core.user.UserModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class MainViewModel : ViewModel() {
    private val exampleApi = ExampleApi()

    private val _data = MutableStateFlow("Cargando...")
    val data: StateFlow<String> = _data

    private val _data2 = MutableStateFlow("Cargando...")
    val data2: StateFlow<String> = _data2

    init {
        fetchUser()
        fetchClient()
    }

    private fun fetchUser() {
        viewModelScope.launch {
            try {
                val data = GenericService.getAll<UserModel, UserData>("user") { it.user }
                val result = data.joinToString("\n") { user ->
                    val name = "${user.firstname_user} ${user.lastname_user}"
                    val role = user.role?.name_role ?: "Sin rol"
                    "$name - $role"
                }
                _data.value = result
            } catch (e: ApiException) {
                val camposFaltantes = e.error?.missingFields?.joinToString(", ") ?: ""
                _data.value = "Error: ${e.message} ${if (camposFaltantes.isNotEmpty()) "\nCampos: $camposFaltantes" else ""}"
            } catch (e: Exception) {
                _data.value = "Error inesperado: ${e.message}"
            }
        }
    }

    private fun fetchClient() {
        viewModelScope.launch {
            try {
                val result = exampleApi.getClients()
                _data2.value = result.toString()
            } catch (e: Exception) {
                _data2.value = "Error: ${e.localizedMessage}"
            }
        }
    }
}