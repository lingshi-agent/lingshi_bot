package ai.lingshi.android.ui

import androidx.compose.runtime.Composable
import ai.lingshi.android.MainViewModel
import ai.lingshi.android.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
