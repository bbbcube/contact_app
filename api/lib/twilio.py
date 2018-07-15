from twilio.rest import Client


class TwilioApi:

    def __init__(self, account_sid, auth_token):

        self.account_sid = account_sid
        self.auth_token = auth_token

        self.client = Client(account_sid, auth_token)

    def send_message(self, body, from_, to):

        # send sms
        message = self.client.messages.create(body, from_, to)

        if message:
            return message
        return None
