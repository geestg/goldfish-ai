package com.goldfish.ai.network

import android.util.Log
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File
import java.io.IOException

object UploadService {

    private val client = OkHttpClient()

    fun upload(file: File) {

        Log.d("UPLOAD", "Uploading file: ${file.name}")

        val mediaType = if (file.name.endsWith(".mp4")) {
            "video/mp4"
        } else {
            "image/*"
        }

        val requestBody = file.asRequestBody(mediaType.toMediaType())

        val body = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("file", file.name, requestBody)
            .build()

        val request = Request.Builder()
            .url("http://192.168.137.1:8000/api/upload")
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {

            override fun onFailure(call: Call, e: IOException) {
                Log.e("UPLOAD", "FAILED", e)
            }

            override fun onResponse(call: Call, response: Response) {
                Log.d("UPLOAD", "SUCCESS: ${response.code}")
            }
        })
    }
}