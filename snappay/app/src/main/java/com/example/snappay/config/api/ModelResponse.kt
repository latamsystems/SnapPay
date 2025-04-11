package com.example.snappay.config.api

import kotlinx.serialization.Serializable

@Serializable
data class BaseResponse<T>(
    val ok: Boolean,
    val msg: String,
    val data: T? = null,
    val meta: Meta? = null
)

@Serializable
data class ErrorResponse(
    val ok: Boolean,
    val msg: String,
    val error: Boolean,
    val missingFields: List<String>? = null,
    val field: String? = null
)

@Serializable
data class Meta(
    val page: Page,
    val sort: Sort
)

@Serializable
data class Page(
    val currentPage: Int,
    val totalPages: Int,
    val totalRecords: Int,
    val limit: Int
)

@Serializable
data class Sort(
    val by: String,
    val order: String
)