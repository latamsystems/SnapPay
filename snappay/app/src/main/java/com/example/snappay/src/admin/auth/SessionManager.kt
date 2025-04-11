package com.example.snappay.src.admin.auth

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

object SessionManager {

    private val _user = MutableStateFlow<UserDetails?>(null)
    val user: StateFlow<UserDetails?> = _user

    fun setUser(details: UserDetails?) {
        _user.value = details
    }

    fun clearUser() {
        _user.value = null
    }

    fun isLoggedIn(): Boolean {
        return _user.value != null
    }
}