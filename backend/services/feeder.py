from services.history_service import get_recent_data

def calculate_feeding(num_fish, avg_length):

    # ===== BASE FEED =====
    base = num_fish * avg_length * 0.1

    history = get_recent_data(5)

    if not history:
        return round(base, 2)

    avg_prev = sum([h.num_fish for h in history]) / len(history)

    # ===== ADAPTIVE LOGIC =====
    if num_fish > avg_prev:
        base *= 1.2  # naik
    elif num_fish < avg_prev:
        base *= 0.8  # turun

    return round(base, 2)