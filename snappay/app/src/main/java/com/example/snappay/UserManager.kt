package com.example.snappay.utils

import android.content.Context
import android.util.Log
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.FirebaseFirestoreSettings
import com.google.firebase.installations.FirebaseInstallations
import java.io.File

object UserManager {

    private const val COLLECTION = "usuarios_fid"
    private const val TAG = "UserManager"

    fun checkOrCreateUser(context: Context, onUserReady: (String) -> Unit) {
        val db = FirebaseFirestore.getInstance()
        db.firestoreSettings = FirebaseFirestoreSettings.Builder()
            .setPersistenceEnabled(false) // Desactiva cache para pruebas
            .build()

        val auth = FirebaseAuth.getInstance()

        FirebaseInstallations.getInstance().id.addOnSuccessListener { fid ->
            Log.d(TAG, "🆔 Firebase Installation ID: $fid")

            val signInTask = if (auth.currentUser != null) {
                Log.d(TAG, "✅ Usuario ya autenticado")
                null
            } else {
                auth.signInAnonymously()
            }

            val afterAuth: () -> Unit = {
                db.collection(COLLECTION).document(fid).get()
                    .addOnSuccessListener { doc ->
                        if (doc.exists()) {
                            val savedUid = doc.getString("uid")
                            if (!savedUid.isNullOrEmpty()) {
                                guardarUidExterno(context, savedUid)
                                Log.d(TAG, "✅ UID recuperado desde Firestore: $savedUid")
                                onUserReady(savedUid)
                            }
                        } else {
                            val newUid = auth.currentUser?.uid ?: return@addOnSuccessListener
                            guardarUidExterno(context, newUid)

                            db.collection(COLLECTION).document(fid)
                                .set(mapOf("uid" to newUid))
                                .addOnSuccessListener {
                                    Log.d(TAG, "✅ UID nuevo guardado: $newUid")
                                    onUserReady(newUid)
                                }
                                .addOnFailureListener {
                                    Log.e(TAG, "❌ Error guardando UID en Firestore", it)
                                }
                        }
                    }
                    .addOnFailureListener {
                        Log.e(TAG, "❌ Error al consultar Firestore", it)
                    }
            }

            if (signInTask != null) {
                signInTask.addOnSuccessListener { afterAuth() }
                    .addOnFailureListener {
                        Log.e(TAG, "❌ Error en auth anónima", it)
                    }
            } else {
                afterAuth()
            }
        }.addOnFailureListener {
            Log.e(TAG, "❌ Error obteniendo FID", it)
        }
    }

    private fun guardarUidExterno(context: Context, uid: String) {
        val file = File(context.getExternalFilesDir(null), ".snappay_uid.txt")
        file.writeText(uid)
    }
}