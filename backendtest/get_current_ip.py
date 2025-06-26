import socket
from pathlib import Path

def find_local_ip_address():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(('1.1.1.1', 80))
        local_ip = sock.getsockname()[0]
    except Exception:
        local_ip = '127.0.0.1'
    finally:
        sock.close()
    return local_ip

def save_env_variable(ip_address: str, env_file: Path):
    content = f"EXPO_PUBLIC_API_URL=http://{ip_address}:5000\n"
    env_file.parent.mkdir(parents=True, exist_ok=True)
    with env_file.open('w') as file:
        file.write(content)
    print(f".env bestand weggeschreven naar: {env_file}")
    print(f"Met inhoud: {content.strip()}")

if __name__ == "__main__":
    ip_addr = find_local_ip_address()
    base_path = Path(__file__).parent.resolve()
    env_path = base_path / "Racademy" / ".env"
    save_env_variable(ip_addr, env_path)
