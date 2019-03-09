import os.path
import time
import json


def current_time():
    format = '%Y/%m/%d %H:%M:%S'
    value = time.localtime(int(time.time()))
    dt = time.strftime(format, value)
    return dt


def debug(*args, **kwargs):
    dt = current_time()
    print(dt, *args, **kwargs)


def log(*args, **kwargs):
    '''
    写入日志文件
    '''
    dt = current_time()
    with open('log.txt', 'a', encoding='utf-8') as f:
        print(dt, *args, file=f, **kwargs)