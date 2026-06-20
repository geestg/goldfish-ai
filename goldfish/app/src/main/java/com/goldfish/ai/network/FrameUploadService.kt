package com.goldfish.ai.network

import android.util.Log
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File
import java.io.IOException

object FrameUploadService {

    private val client = OkHttpClient()

    private const val FRAME_URL =
        "http://192.168.137.1:8000/api/camera/frame"

    fun uploadFrame(
        file: File
    ) {

        if (!file.exists()) {
            return
        }

        try {

            val requestBody =
                file.asRequestBody(
                    "image/jpeg".toMediaType()
                )

            val body =
                MultipartBody.Builder()
                    .setType(
                        MultipartBody.FORM
                    )
                    .addFormDataPart(
                        "frame",
                        file.name,
                        requestBody
                    )
                    .build()

            val request =
                Request.Builder()
                    .url(FRAME_URL)
                    .post(body)
                    .build()

            client.newCall(request)
                .enqueue(object : Callback {

                    override fun onFailure(
                        call: Call,
                        e: IOException
                    ) {

                        Log.e(
                            "FRAME",
                            "UPLOAD FAILED",
                            e
                        )
                    }

                    override fun onResponse(
                        call: Call,
                        response: Response
                    ) {

                        Log.d(
                            "FRAME",
                            "FRAME SENT ${response.code}"
                        )

                        response.close()
                    }
                })

        } catch (e: Exception) {

            Log.e(
                "FRAME",
                "ERROR",
                e
            )
        }
    }
}