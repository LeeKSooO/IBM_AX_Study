user_info = []

def register_user():
    user = {
        "name": input("이름을 입력하세요: "),
        "ph_num": input("전화번호를 입력하세요: "),
        "address": input("주소를 입력하세요: ")
    }
    user_info.append(user)
    print(f"{user['name']}님 회원가입을 축하합니다!!!")
    show_info()

def modify_user():
    name = input("수정할 회원의 이름을 입력하세요: ")
    for user in user_info:
        if user["name"] == name:
            print("수정할 회원이름을 입력해주세요.")
            user["name"] = input(f"이름({user['name']}): ") or user["name"]
            user["ph_num"] = input(f"전화번호({user['ph_num']}): ") or user["ph_num"]
            user["address"] = input(f"주소({user['address']}): ") or user["address"]
            print("회원정보가 수정되었습니다.")
            return
    print("해당 이름의 회원을 찾을 수 없습니다.")

def delete_user():
    name = input("삭제할 회원의 이름을 입력하세요: ")
    for user in user_info:
        if user["name"] == name:
            user_info.remove(user)  
            print(f"{name}님의 회원정보가 삭제되었습니다.")
            return
    print("해당 이름의 회원을 찾을 수 없습니다.")

def info_user():
    show_info()

def show_info():
    if not user_info:
        print("회원 정보가 없습니다.")
        return
    print("회원님들의 정보입니다.")
    for user in user_info:
        print(f"이름: {user['name']}, 전화번호: {user['ph_num']}, 주소: {user['address']}")

def main():
    while True:
        print("-----회원정보 입력 시스템-----")
        print("1. 회원정보 등록")
        print("2. 회원정보 수정")
        print("3. 회원정보 삭제")
        print("4. 회원정보 보기")
        print("5. 프로그램 종료")
        choice = input("선택 (1~5): ")
        if choice == "1":
            register_user()
        elif choice == "2":
            modify_user()
        elif choice == "3":
            delete_user()
        elif choice == "4":
            info_user()
        elif choice == "5":
            print("프로그램을 종료합니다.")
            break
        else:
            print("올바른 번호를 선택해주세요.")

main()
