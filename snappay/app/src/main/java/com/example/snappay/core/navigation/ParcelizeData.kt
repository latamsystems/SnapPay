package com.example.snappay.core.navigation

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import kotlinx.serialization.Serializable

@Parcelize
@Serializable
data class LastInfo(val name: String, val age: Int): Parcelable