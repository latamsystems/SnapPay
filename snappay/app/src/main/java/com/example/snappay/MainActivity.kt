package com.example.snappay

import android.content.res.Configuration
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.snappay.core.navigation.NavigationWarper
//import com.example.snappay.navigation.AppNavigation
import com.example.snappay.ui.theme.SnappayTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SnappayTheme {
                NavigationWarper()
//                AppNavigation()
//                MainScreen()
            }
        }
    }
}






private val messages: List<MyMessage> = listOf(
    MyMessage("Title 1", "Body 1"),
    MyMessage("Title 2", "Body 2"),
    MyMessage("Title 3", "Body 3"),
    MyMessage("Title 4", "Body 4"),
    MyMessage("Title 5", "Body 5"),
    MyMessage("Title 6", "Body 6"),
    MyMessage("Title 7", "Body 7"),
    MyMessage("Title 8", "Body 8"),
    MyMessage("Title 9", "Body 9"),
    MyMessage("Title 10", "Body 10"),
    MyMessage("Title 11", "Body 11"),
    MyMessage("Title 12", "Body 12"),
    MyMessage("Title 13", "Body 13"),
    MyMessage("Title 14", "Body 14"),
    MyMessage("Title 15", "Body 15"),
    MyMessage("Title 16", "Body 16"),
    MyMessage("Title 17", "Body 17"),
    MyMessage("Title 18", "Body 18"),
    MyMessage("Title 19", "Body 19"),
    MyMessage("Title 20", "Body 20"),
    MyMessage("Title 21", "Body 21"),
    MyMessage("Title 22", "Body 22"),
    MyMessage("Title 23", "Body 23"),
    MyMessage("Title 24", "Body 24"),
    MyMessage("Title 25", "Body 25"),
    MyMessage("Title 26", "Body 26"),
    MyMessage("Title 27", "Body 27"),
    MyMessage("Title 28", "Body 28"),
    MyMessage("Title 29", "Body 29"),
    MyMessage("Title 30", "Body 30"),
    MyMessage("Title 31", "Body 31"),
    MyMessage("Title 32", "Body 32"),
    MyMessage("Title 33", "Body 33"),
    MyMessage("Title 34", "Body 34"),
    MyMessage("Title 35", "Body 35"),
    MyMessage("Title 36", "Body 36"),
    MyMessage("Title 37", "Body 37"),
    MyMessage("Title 38", "Body 38"),
    MyMessage("Title 39", "Body 39"),
)

data class MyMessage(val title: String, val body: String)

@Composable
fun MyMessages (messages: List<MyMessage>) {
    LazyColumn {
        items(messages) { message ->
            MyImage()
            MyTexts(message)
        }
    }
}

@Composable
fun MyComponent() {
    Row(modifier = Modifier.padding(8.dp).background(MaterialTheme.colorScheme.background)) {
        MyImage()
        MyMessages(messages)
    }
}

@Composable
fun MyImage() {
    Image(
        painterResource(R.drawable.ic_launcher_foreground),
        "Logo",
        modifier = Modifier
            .size(64.dp)
            .clip(CircleShape)
//            .background(Color.Gray)
            .background(MaterialTheme.colorScheme.primary)
    )
}

@Composable
fun MyTexts(message: MyMessage) {
    Column() {
        MyText(message.title, Color.Red, MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(15.dp))
        MyText(message.body, MaterialTheme.colorScheme.primary, MaterialTheme.typography.titleMedium)
    }
}

@Composable
fun MyText(text: String, color: Color, style: TextStyle) {
    Text(text, color = color, style = style)
}

@Preview(showSystemUi = true)
//@Preview(showBackground = true)
//@Preview(uiMode = Configuration.UI_MODE_NIGHT_YES)
@Composable
fun DefaultPreview() {
    SnappayTheme {
//        AppNavigation()
//        val scrollState = rememberScrollState()
////        Column(modifier = Modifier.verticalScroll(scrollState)) {
//            MyComponent()
////        }
    }
}