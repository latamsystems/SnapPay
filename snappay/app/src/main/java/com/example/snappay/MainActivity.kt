package com.example.snappay

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.example.snappay.config.screen.MainScaffold
import com.example.snappay.ui.theme.SnappayTheme
//import com.example.snappay.utils.UserManager
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

//        // ✅ Inicializar Firebase
//        FirebaseApp.initializeApp(this)
//
//        // ✅ Iniciar sesión anónima automáticamente
//        signInAnonymously()

//        // 🧠 Manejar UID persistente con FID
//        UserManager.checkOrCreateUser(this) { uid ->
//            Log.d("FIREBASE", "✅ Usuario listo con UID: $uid")
//        }

        enableEdgeToEdge()
        setContent {
            SnappayTheme {
                MainScaffold()
            }
        }
    }

    private fun signInAnonymously() {
        val auth = FirebaseAuth.getInstance()

        // ✅ Intentar recuperar UID guardado externamente
        val uidGuardado = leerUidExterno(this)
        if (uidGuardado != null) {
            Log.d("FIREBASE", "✅ UID recuperado del almacenamiento externo: $uidGuardado")
            return
        }

        // ✅ Si ya hay sesión activa, guardar su UID
        if (auth.currentUser != null) {
            val uid = auth.currentUser?.uid
            uid?.let {
                guardarUidExterno(this, it)
                Log.d("FIREBASE", "✅ Usuario ya autenticado, UID guardado: $it")
            }
        } else {
            // ✅ Si no hay sesión, iniciar sesión anónima
            auth.signInAnonymously()
                .addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        val uid = task.result?.user?.uid
                        uid?.let {
                            guardarUidExterno(this, it)
                            Log.d("FIREBASE", "✅ Autenticación anónima exitosa, UID guardado: $it")
                        }
                    } else {
                        Log.e("FIREBASE", "❌ Error al autenticar", task.exception)
                    }
                }
        }
    }
}