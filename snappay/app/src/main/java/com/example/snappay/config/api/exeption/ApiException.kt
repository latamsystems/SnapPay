package com.example.snappay.config.api.exeption

import com.example.snappay.config.api.ErrorResponse

class ApiException(
    override val message: String,
    val error: ErrorResponse? = null
) : Exception(message)