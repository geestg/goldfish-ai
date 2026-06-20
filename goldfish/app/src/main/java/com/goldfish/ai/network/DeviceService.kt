package com.goldfish.ai.network

import android.util.Log
import okhttp3.*
import org.json.JSONObject
import java.io.IOException

object DeviceService {

    private val client = OkHttpClient()

    fun pollCommand(
        onResult: (String, String) -> Unit
    ) {

        val request = Request.Builder()
            .url("http://192.168.137.1:8000/api/device/command")
            .get()
            .build()

        client.newCall(request).enqueue(object : Callback {

            override fun onFailure(
                call: Call,
                e: IOException
            ) {

                Log.e(
                    "POLL",
                    "FAILED",
                    e
                )
            }

            override fun onResponse(
                call: Call,
                response: Response
            ) {

                val body =
                    response.body?.string()
                        ?: return

                try {

                    val json =
                        JSONObject(body)

                    val action =
                        json.optString(
                            "action",
                            "none"
                        )

                    val type =
                        json.optString(
                            "type",
                            "image"
                        )

                    onResult(
                        action,
                        type
                    )

                } catch (e: Exception) {

                    Log.e(
                        "POLL",
                        "JSON ERROR",
                        e
                    )

                }
            }
        })
    }
}