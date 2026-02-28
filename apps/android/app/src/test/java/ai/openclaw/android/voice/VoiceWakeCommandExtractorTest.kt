package ai.lingshi.android.voice

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class VoiceWakeCommandExtractorTest {
  @Test
  fun extractsCommandAfterTriggerWord() {
    val res = VoiceWakeCommandExtractor.extractCommand("Claude take a photo", listOf("lingshi", "claude"))
    assertEquals("take a photo", res)
  }

  @Test
  fun extractsCommandWithPunctuation() {
    val res = VoiceWakeCommandExtractor.extractCommand("hey lingshi, what's the weather?", listOf("lingshi"))
    assertEquals("what's the weather?", res)
  }

  @Test
  fun returnsNullWhenNoCommandProvided() {
    assertNull(VoiceWakeCommandExtractor.extractCommand("claude", listOf("claude")))
    assertNull(VoiceWakeCommandExtractor.extractCommand("hey claude!", listOf("claude")))
  }
}
