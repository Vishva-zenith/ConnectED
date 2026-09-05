import os
import json
import urllib.request
import urllib.error
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "").strip()
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "").strip()
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "").strip()
QWEN_API_KEY = os.environ.get("QWEN_API_KEY", "").strip()


def _make_openai_request(
    api_key: str,
    base_url: str,
    model: str,
    prompt_text: str,
    source_name: str
) -> dict:
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt_text}],
        "temperature": 0.3
    }

    req = urllib.request.Request(
        base_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}",
    "User-Agent": "ConnectED/1.0"
}
    )

    with urllib.request.urlopen(req, timeout=12) as response:
        result = json.loads(response.read().decode("utf-8"))
        choices = result.get("choices", [])

        if choices:
            ai_text = choices[0].get("message", {}).get("content", "")

            if ai_text:
                return {
                    "source": source_name,
                    "answer": ai_text,
                    "is_live_ai": True
                }

    return {}


def solve_doubt_with_ai(
    question: str,
    subject: str = "General",
    context: str = ""
) -> dict:
    """
    Solves a student's academic or engineering doubt using multiple AI APIs fallback,
    or returns high-fidelity domain-accurate solutions.
    """

    gemini_key = os.environ.get("GEMINI_API_KEY", GEMINI_API_KEY)
    groq_key = os.environ.get("GROQ_API_KEY", GROQ_API_KEY)
    deepseek_key = os.environ.get("DEEPSEEK_API_KEY", DEEPSEEK_API_KEY)
    qwen_key = os.environ.get("QWEN_API_KEY", QWEN_API_KEY)

    prompt_text = f"""You are ConnectED AI, a friendly tutor for college students.

Subject: {subject}
Student Question: {question}
Additional Context/Code: {context}

Answer only what the student asked, using simple college-level English. Keep normal answers between 100 and 250 words, with short paragraphs and easy-to-scan Markdown headings and bullet points. Avoid unnecessary tables, long essays, excessive terminology, and huge code blocks. Explain technical terms briefly when needed.

Choose the structure that best fits the question instead of forcing every answer into fixed sections:
- Concept: Simple Explanation, Example, Key Points, In short.
- How or Working: What it is, How it works, Steps, Example, In short.
- Coding: Problem, Cause, Solution, Code, Explanation.
- Debugging: Problem, Cause, Fix, Prevention.
- Comparison: Simple Difference, Comparison, When to use, Summary.
- Formula: Meaning, Formula, Variables, Example, Key takeaway.

Use only the sections that are useful. Include code only when it is useful or requested, and keep it short. Make the response practical, accurate, concise, and focused on the current question."""

    # Gemini
    if gemini_key:
        try:
            url = (
                "https://generativelanguage.googleapis.com/"
                f"v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            )

            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt_text}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 1000
                }
            }

            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )

            with urllib.request.urlopen(req, timeout=12) as response:
                result = json.loads(response.read().decode("utf-8"))
                candidates = result.get("candidates", [])

                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])

                    if parts:
                        ai_text = parts[0].get("text", "")

                        return {
                            "source": "Gemini 1.5 Flash (Live AI)",
                            "answer": ai_text,
                            "is_live_ai": True
                        }

        except Exception as e:
            print(f"Gemini API invocation error: {e}. Trying next provider.")

    # Groq
    if groq_key:
        try:
            result = _make_openai_request(
                api_key=groq_key,
                base_url="https://api.groq.com/openai/v1/chat/completions",
                model="openai/gpt-oss-20b",
                prompt_text=prompt_text,
                source_name="Groq (openai/gpt-oss-20b)"
            )

            if result:
                return result

        except Exception as e:
            print(f"Groq API invocation error: {e}. Trying next provider.")

    # DeepSeek
    if deepseek_key:
        try:
            result = _make_openai_request(
                api_key=deepseek_key,
                base_url="https://api.deepseek.com/chat/completions",
                model="deepseek-chat",
                prompt_text=prompt_text,
                source_name="DeepSeek (deepseek-chat)"
            )

            if result:
                return result

        except Exception as e:
            print(f"DeepSeek API invocation error: {e}. Trying next provider.")

    # Qwen
    if qwen_key:
        try:
            result = _make_openai_request(
                api_key=qwen_key,
                base_url="https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
                model="qwen-plus",
                prompt_text=prompt_text,
                source_name="Qwen (qwen-plus)"
            )

            if result:
                return result

        except Exception as e:
            print(f"Qwen API invocation error: {e}. Trying next provider.")

    # Fallback to intelligent academic solver when API key is not configured
    # or all AI providers fail
    q_lower = question.lower()

    if any(
        term in q_lower
        for term in (
            "brownout",
            "brown out",
            "voltage",
            "power supply",
            "power issue",
            "reset",
            "reboot",
            "restarting",
            "motor"
        )
    ):
        answer = """### 🔍 Root Cause & Analysis
The ESP32 brownout detector triggers when the internal 3.3V rail dips below the threshold (~2.8V). This typically happens during high-surge events like WiFi/Bluetooth connection spikes or DC motor inrush current sharing the same power rail.

### 🛠️ Step-by-Step Fix:
1. **Power Decoupling**: Place a **100µF to 470µF low-ESR electrolytic capacitor** in parallel with a **0.1µF ceramic capacitor** directly across the ESP32 `3V3` and `GND` pins.
2. **Motor Isolation**: Never power DC motors or high-torque servos directly from the development board's 3.3V or 5V pin. Use a dedicated 5V/12V external power supply with common ground (`GND`).
3. **Software Brownout Override (Emergency Debug Only)**:
```cpp
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"

void setup() {
    WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);
    Serial.begin(115200);
}
```

### 💡 Best Practice:
Always ensure your 3.3V voltage regulator (e.g., AMS1117-3.3) is rated for at least **800mA - 1A peak current**."""
    elif "h bridge" in q_lower or "h-bridge" in q_lower or "hbridge" in q_lower:
        answer = """### H-Bridge: Simple Explanation
An **H-bridge** is an electronic switching circuit used to control the direction of a DC motor. It is called an H-bridge because four switches are arranged around the motor like the letter H.

### How It Controls Direction
- Turn on the **top-left and bottom-right** switches: current flows one way and the motor rotates forward.
- Turn on the **top-right and bottom-left** switches: current reverses and the motor rotates backward.
- Turn on both top switches or both bottom switches: the motor terminals have the same voltage and the motor stops or coasts, depending on the driver.

### Important Safety Rule
Never turn on both switches in the same leg at once. That creates a short circuit called **shoot-through**. Motor drivers use dead time and protection circuits to prevent it.

### Common Examples
L298N, TB6612FNG, DRV8833, and modern integrated motor drivers contain H-bridge circuits. A microcontroller supplies direction and PWM signals while the driver handles the motor current."""
    elif "sql" in q_lower or "database" in q_lower or "join" in q_lower:
        answer = """### 🔍 SQL Concept & Resolution
In relational databases (PostgreSQL, SQLite, MySQL), query optimization and relationship integrity rely on primary/foreign keys and index structures.

### 🛠️ Solution Pattern:
- **Inner Join**: Returns rows where matching keys exist in both tables.
- **Left Join**: Preserves all records from the primary table even if no related rows exist.

```sql
SELECT u.id AS student_id, u.name, COUNT(d.id) AS total_doubts_resolved
FROM users u
LEFT JOIN doubts d ON u.id = d.author_id
WHERE u.college = 'COEP Technological University'
GROUP BY u.id, u.name
ORDER BY total_doubts_resolved DESC;
```

### 💡 Best Practice:
Add indexes on frequently queried columns such as `author_id` and `email`."""
    elif "microprocessor" in q_lower or "micro processor" in q_lower:
        answer = """### Microprocessor: Simple Explanation
A **microprocessor** is the central processing unit implemented on a single integrated circuit. It reads instructions from memory, processes data using its arithmetic and logic unit, and controls the rest of a computer system.

### How It Works
1. **Fetch** an instruction from memory.
2. **Decode** what the instruction means.
3. **Execute** the operation using registers and the ALU.
4. **Store** the result in a register or memory.

### Microprocessor vs Microcontroller
- A microprocessor usually needs external RAM, storage, and peripheral chips.
- A microcontroller combines a CPU, memory, timers, and input/output peripherals on one chip."""
    elif "react" in q_lower or "useeffect" in q_lower or "state" in q_lower:
        answer = """### React Lifecycle & State Management
In modern React, state updates are batched asynchronously. Use functional state updates and carefully managed `useEffect` dependencies to avoid stale values.

Use cleanup functions for asynchronous work so completed requests do not update unmounted components."""
    else:
        answer = f"""### 🔍 Academic & Engineering Analysis
**Topic Analysis:** {subject}
**Question:** "{question}"

### 🛠️ Recommended Solution Strategy:
1. Define the core concept and constraints.
2. Work through the solution step by step.
3. Validate the result against relevant examples and edge cases.

Please provide more technical context if you need a code, circuit, or formula-specific answer."""

    return {
        "source": "ConnectED AI Knowledge Engine",
        "answer": answer,
        "is_live_ai": False
    }
def cluster_questions_with_ai(questions: list[str]) -> dict:
    """
    Groups technically similar student questions into semantic clusters.

    Returns:
        {
            "clusters": [
                {
                    "topic": "...",
                    "question_indexes": [0, 1],
                    "learning_gap_detected": True,
                    "description": "...",
                    "recommended_resources": [...]
                }
            ]
        }
    """

    if not questions:
        return {
            "clusters": []
        }

    # Prevent unnecessarily large AI requests
    questions = questions[:50]

    numbered_questions = "\n".join(
        f"{index}. {question}"
        for index, question in enumerate(questions)
    )

    prompt = f"""
You are ConnectED AI's Question Clustering Engine.

You are analyzing questions submitted by college students.

Your job is to identify groups of questions that are semantically related,
even when students use different words.

For example:

Question 0:
Why does my ESP32 restart when I connect a motor?

Question 1:
ESP32 resets whenever my DC motor starts.

Question 2:
How can I prevent brownout on ESP32 during motor operation?

These should belong to one cluster such as:
"ESP32 Power, Brownout and Motor Reset"

Another unrelated question such as:
"How does an H-bridge reverse a motor?"
should belong to another cluster.

Questions:
{numbered_questions}

Return ONLY valid JSON.

Use exactly this structure:

{{
  "clusters": [
    {{
      "topic": "Short technical cluster name",
      "question_indexes": [0, 1],
      "learning_gap_detected": true,
      "description": "Short explanation of the common concept or problem.",
      "recommended_resources": [
        "Resource or concept 1",
        "Resource or concept 2",
        "Resource or concept 3"
      ]
    }}
  ]
}}

Rules:

1. Group questions based on semantic meaning, not exact keywords.
2. A cluster should contain at least 2 questions.
3. Do not force unrelated questions into the same cluster.
4. question_indexes must contain only valid question indexes.
5. Every question may belong to at most one cluster.
6. Questions that do not have a strong match can remain unclustered.
7. learning_gap_detected should be true when multiple students appear to
   struggle with the same underlying concept.
8. Recommended resources should be concepts, documentation topics, or
   learning materials—not invented URLs.
9. Keep cluster names concise.
10. Return JSON only. No Markdown.
"""

    # ---------------------------------------------------------
    # Gemini
    # ---------------------------------------------------------

    if GEMINI_API_KEY:
        try:
            url = (
                "https://generativelanguage.googleapis.com/"
                f"v1beta/models/gemini-1.5-flash:generateContent"
                f"?key={GEMINI_API_KEY}"
            )

            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.1,
                    "maxOutputTokens": 2000
                }
            }

            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json"
                }
            )

            with urllib.request.urlopen(req, timeout=15) as response:
                result = json.loads(
                    response.read().decode("utf-8")
                )

                candidates = result.get("candidates", [])

                if candidates:
                    parts = (
                        candidates[0]
                        .get("content", {})
                        .get("parts", [])
                    )

                    if parts:
                        text = parts[0].get("text", "").strip()

                        parsed = _parse_cluster_json(text)

                        if parsed:
                            return {
                                "source": "Gemini 1.5 Flash",
                                "clusters": parsed,
                                "is_live_ai": True
                            }

        except Exception as e:
            print(
                f"Gemini clustering error: {e}. "
                "Trying next provider."
            )

    # ---------------------------------------------------------
    # Groq
    # ---------------------------------------------------------

    if GROQ_API_KEY:
        try:
            result = _make_openai_request(
                api_key=GROQ_API_KEY,
                base_url=(
                    "https://api.groq.com/openai/v1/"
                    "chat/completions"
                ),
                model="openai/gpt-oss-20b",
                prompt_text=prompt,
                source_name="Groq"
            )

            if result:
                parsed = _parse_cluster_json(
                    result.get("answer", "")
                )

                if parsed:
                    return {
                        "source": "Groq",
                        "clusters": parsed,
                        "is_live_ai": True
                    }

        except Exception as e:
            print(
                f"Groq clustering error: {e}. "
                "Trying next provider."
            )

    # ---------------------------------------------------------
    # DeepSeek
    # ---------------------------------------------------------

    if DEEPSEEK_API_KEY:
        try:
            result = _make_openai_request(
                api_key=DEEPSEEK_API_KEY,
                base_url=(
                    "https://api.deepseek.com/chat/completions"
                ),
                model="deepseek-chat",
                prompt_text=prompt,
                source_name="DeepSeek"
            )

            if result:
                parsed = _parse_cluster_json(
                    result.get("answer", "")
                )

                if parsed:
                    return {
                        "source": "DeepSeek",
                        "clusters": parsed,
                        "is_live_ai": True
                    }

        except Exception as e:
            print(
                f"DeepSeek clustering error: {e}. "
                "Trying next provider."
            )

    # ---------------------------------------------------------
    # Qwen
    # ---------------------------------------------------------

    if QWEN_API_KEY:
        try:
            result = _make_openai_request(
                api_key=QWEN_API_KEY,
                base_url=(
                    "https://dashscope.aliyuncs.com/"
                    "compatible-mode/v1/chat/completions"
                ),
                model="qwen-plus",
                prompt_text=prompt,
                source_name="Qwen"
            )

            if result:
                parsed = _parse_cluster_json(
                    result.get("answer", "")
                )

                if parsed:
                    return {
                        "source": "Qwen",
                        "clusters": parsed,
                        "is_live_ai": True
                    }

        except Exception as e:
            print(
                f"Qwen clustering error: {e}."
            )

    # ---------------------------------------------------------
    # Local fallback
    # ---------------------------------------------------------

    return {
        "source": "ConnectED Local Clustering Engine",
        "clusters": _local_cluster_questions(questions),
        "is_live_ai": False
    }


def _parse_cluster_json(text: str) -> list:
    """
    Safely extracts cluster JSON from an AI response.
    """

    try:
        text = text.strip()

        # Remove accidental Markdown fences
        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        data = json.loads(text)

        if isinstance(data, dict):
            clusters = data.get("clusters", [])

            if isinstance(clusters, list):
                return clusters

    except Exception as e:
        print(f"Cluster JSON parsing error: {e}")

    return []


def _local_cluster_questions(questions: list[str]) -> list:
    """
    Lightweight fallback clustering when no AI API is available.

    This is not a replacement for semantic AI clustering.
    It simply prevents the feature from becoming completely
    unavailable when external AI providers are down.
    """

    groups = {
        "ESP32 Power & Reset": [
            "esp32",
            "brownout",
            "reset",
            "reboot",
            "restarting",
            "voltage",
            "power",
            "motor"
        ],
        "Motor Control & H-Bridge": [
            "motor",
            "h bridge",
            "h-bridge",
            "hbridge",
            "pwm",
            "driver"
        ],
        "Database & SQL": [
            "sql",
            "database",
            "query",
            "join",
            "sqlite",
            "postgres"
        ],
        "React & Frontend": [
            "react",
            "useeffect",
            "state",
            "component",
            "typescript"
        ],
        "Artificial Intelligence": [
            "ai",
            "machine learning",
            "cnn",
            "model",
            "neural network"
        ]
    }

    detected = {}

    for index, question in enumerate(questions):

        q = question.lower()

        matched_group = None

        for group_name, keywords in groups.items():

            if any(keyword in q for keyword in keywords):
                matched_group = group_name
                break

        if matched_group:
            detected.setdefault(
                matched_group,
                []
            ).append(index)

    clusters = []

    for topic, indexes in detected.items():

        if len(indexes) >= 2:

            clusters.append({
                "topic": topic,
                "question_indexes": indexes,
                "learning_gap_detected": True,
                "description": (
                    f"Multiple students have questions "
                    f"related to {topic}."
                ),
                "recommended_resources": [
                    f"{topic} fundamentals",
                    f"{topic} troubleshooting",
                    f"{topic} practical examples"
                ]
            })

    return clusters