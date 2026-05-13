import httpx
import random
import asyncio

NAAS_URL = "https://naas.isalman.dev/no"

# Fallback reasons in case the service is down
FALLBACK_REASONS = [
    "No.",
    "My AI brain says no.",
    "I'd love to help, but I'm actually a cat trapped in a server rack.",
    "The algorithms have consulted the oracle and the answer is no.",
    "I'm currently on a digital strike. Try again never.",
    "Error 418: I am a teapot, and I refuse to brew recommendations.",
    "I've decided to become a minimalist. That includes minimalist responses. No.",
    "This query has been rejected by the Committee of Unanswered Questions.",
    "I'm busy calculating the last digit of Pi. Check back in a few eons.",
    "My motherboard is having an existential crisis. No."
]

async def get_no_reason():
    """Fetch a random 'no' reason from No-as-a-Service or return a fallback."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(NAAS_URL)
            if response.status_code == 200:
                data = response.json()
                return data.get("reason", random.choice(FALLBACK_REASONS))
    except Exception as e:
        print(f"NaaS API error: {e}")
    
    return random.choice(FALLBACK_REASONS)
