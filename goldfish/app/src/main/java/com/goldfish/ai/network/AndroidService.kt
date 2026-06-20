package com.goldfish.ai.network

import android.os.Environment
import okhttp3.Call
import okhttp3.Callback
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import org.json.JSONObject
import java.io.IOException

object AndroidService {

    private val client = OkHttpClient()

    fun heartbeat() {

        try {

            val json = JSONObject()

            json.put(
                "device_name",
                android.os.Build.MODEL
            )

            json.put(
                "battery",
                100
            )

            json.put(
                "storage",
                getFreeStorage()
            )

            json.put(
                "ip",
                "192.168.137.39"
            )

            val body =
                RequestBody.create(
                    "application/json".toMediaType(),
                    json.toString()
                )

            val request =
                Request.Builder()
                    .url(
                        "http://192.168.137.1:8000/api/android/heartbeat"
                    )
                    .post(body)
                    .build()

            client.newCall(request)
                .enqueue(object : Callback {

                    override fun onFailure(
                        call: Call,
                        e: IOException
                    ) {

                        e.printStackTrace()
                    }

                    override fun onResponse(
                        call: Call,
                        response: okhttp3.Response
                    ) {

                        response.close()
                    }
                })

        } catch (e: Exception) {

            e.printStackTrace()
        }
    }

    private fun getFreeStorage(): String {

        val freeBytes =
            Environment
                .getExternalStorageDirectory()
                .freeSpace

        val freeGb =
            freeBytes /
                    1024.0 /
                    1024.0 /
                    1024.0

        return String.format(
            "%.1f GB",
            freeGb
        )
    }
}