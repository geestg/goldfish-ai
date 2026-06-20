import threading
import queue
from utils.logger import logger
from services.processor import process

task_queue = queue.Queue()


# ================= ADD TASK =================
def add_task(task):
    logger.info(f"[QUEUE] add task → {task}")
    task_queue.put(task)


# ================= WORKER LOOP =================
def worker_loop():
    logger.info("[WORKER] running...")

    while True:
        task = task_queue.get()

        try:
            process(task)
        except Exception as e:
            logger.error(f"[WORKER ERROR] {e}")

        finally:
            task_queue.task_done()


# ================= START =================
def start_worker():
    thread = threading.Thread(target=worker_loop, daemon=True)
    thread.start()