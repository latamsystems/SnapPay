package com.example.snappay

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class MainViewModel : ViewModel() {
    private val apiService = ApiService()

    private val _data = MutableStateFlow("Cargando...")
    val data: StateFlow<String> = _data

    init {
        fetchData()
    }

    private fun fetchData() {
        viewModelScope.launch {
            try {
                val result = apiService.getData()
                _data.value = result
            } catch (e: Exception) {
                _data.value = "Error: ${e.localizedMessage}"
            }
        }
    }
}
