package com.goldfish.ai.camera

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.camera.core.ImageCapture
import com.goldfish.ai.network.FrameUploadService

class LiveFrameManager(

    private val context: Context,

    private val imageCapture: ImageCapture

) {

    private val handler =
        Handler(
            Looper.getMainLooper()
        )

    private var running = false

    private val frameRunnable =
        object : Runnable {

            override fun run() {

                if (!running) {
                    return
                }

                try {

                    val cameraManager =
                        CameraManager(
                            imageCapture
                        )

                    cameraManager.takePhoto(
                        context
                    ) { file ->

                        FrameUploadService
                            .uploadFrame(
                                file
                            )
                    }

                } catch (e: Exception) {

                    Log.e(
                        "LIVE_FRAME",
                        "CAPTURE ERROR",
                        e
                    )
                }

                handler.postDelayed(
                    this,
                    2000
                )
            }
        }

    fun start() {

        if (running) {
            return
        }

        running = true

        handler.post(
            frameRunnable
        )

        Log.d(
            "LIVE_FRAME",
            "STARTED"
        )
    }

    fun stop() {

        running = false

        handler.removeCallbacks(
            frameRunnable
        )

        Log.d(
            "LIVE_FRAME",
            "STOPPED"
        )
    }
}